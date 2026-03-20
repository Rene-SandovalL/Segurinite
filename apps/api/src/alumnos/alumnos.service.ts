import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Prisma,
  alumno_contactos_tipo,
  alumnos_estado,
  alumnos_tipo_sangre,
  pulseras_estado,
} from '../generated/prisma/client';
import {
  ContactoEmergenciaCreateAlumnoDto,
  CreateAlumnoDto,
  TutorCreateAlumnoDto,
} from './dto/create-alumno.dto';

interface AlumnoWithRelations {
  id: bigint;
  nombre: string;
  apellido: string;
  fecha_nacimiento: Date | null;
  tipo_sangre: alumnos_tipo_sangre | null;
  estado: alumnos_estado;
  grupos: {
    id: number;
    nombre: string;
    color_id: number;
    colores: {
      id: number;
      nombre: string | null;
      valor_hex: string;
    };
  } | null;
  pulseras: {
    id: bigint;
    uuid: string;
    estado: pulseras_estado;
    last_seen_at: Date | null;
  } | null;
  alumno_contactos: Array<{
    tipo: alumno_contactos_tipo;
    orden: number | null;
    parentesco: string | null;
    nombre: string;
    telefono: string;
    fecha_nacimiento: Date | null;
    direccion: string | null;
  }>;
}

export interface AlumnoResponse {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string | null;
  tipoSangre: string | null;
  estado: alumnos_estado;
  grupo: {
    id: number;
    nombre: string;
    colorId: number;
    colorNombre: string | null;
    colorHex: string;
  } | null;
  pulsera: {
    id: string;
    uuid: string;
    estado: pulseras_estado;
    lastSeenAt: string | null;
  } | null;
  contactos: Array<{
    tipo: alumno_contactos_tipo;
    orden: number | null;
    parentesco: string | null;
    nombre: string;
    telefono: string;
    fechaNacimiento: string | null;
    direccion: string | null;
    esTutor: boolean;
  }>;
}

const ALUMNO_SELECT: Prisma.alumnosSelect = {
  id: true,
  nombre: true,
  apellido: true,
  fecha_nacimiento: true,
  tipo_sangre: true,
  estado: true,
  grupos: {
    select: {
      id: true,
      nombre: true,
      color_id: true,
      colores: {
        select: {
          id: true,
          nombre: true,
          valor_hex: true,
        },
      },
    },
  },
  pulseras: {
    select: {
      id: true,
      uuid: true,
      estado: true,
      last_seen_at: true,
    },
  },
  alumno_contactos: {
    select: {
      tipo: true,
      orden: true,
      parentesco: true,
      nombre: true,
      telefono: true,
      fecha_nacimiento: true,
      direccion: true,
    },
    orderBy: [{ tipo: 'asc' }, { orden: 'asc' }],
  },
};

@Injectable()
export class AlumnosService {
  constructor(private readonly prisma: PrismaService) {}

  private static readonly BLOOD_TYPE_FROM_INPUT: Record<
    string,
    alumnos_tipo_sangre
  > = {
    'A+': alumnos_tipo_sangre.A_POS,
    'A-': alumnos_tipo_sangre.A_NEG,
    'B+': alumnos_tipo_sangre.B_POS,
    'B-': alumnos_tipo_sangre.B_NEG,
    'AB+': alumnos_tipo_sangre.AB_POS,
    'AB-': alumnos_tipo_sangre.AB_NEG,
    'O+': alumnos_tipo_sangre.O_POS,
    'O-': alumnos_tipo_sangre.O_NEG,
  };

  private static readonly BLOOD_TYPE_LABEL: Record<
    alumnos_tipo_sangre,
    string
  > = {
    A_POS: 'A+',
    A_NEG: 'A-',
    B_POS: 'B+',
    B_NEG: 'B-',
    AB_POS: 'AB+',
    AB_NEG: 'AB-',
    O_POS: 'O+',
    O_NEG: 'O-',
  };

  private mapDate(value: Date | null): string | null {
    return value ? value.toISOString() : null;
  }

  private mapTipoSangre(value: alumnos_tipo_sangre | null): string | null {
    if (!value) {
      return null;
    }

    return AlumnosService.BLOOD_TYPE_LABEL[value] ?? value;
  }

  private mapTipoSangreInput(
    value: string | undefined,
  ): alumnos_tipo_sangre | null {
    if (!value) {
      return null;
    }

    return AlumnosService.BLOOD_TYPE_FROM_INPUT[value] ?? null;
  }

  private parseBigIntId(value: string, nombreCampo: string): bigint {
    try {
      const parsed = BigInt(value);

      if (parsed <= 0n) {
        throw new Error('id no válido');
      }

      return parsed;
    } catch {
      throw new BadRequestException(
        `${nombreCampo} debe ser un entero positivo`,
      );
    }
  }

  private mapTutorAContacto(
    tutor: TutorCreateAlumnoDto,
    orden: number,
  ): Prisma.alumno_contactosUncheckedCreateWithoutAlumnosInput {
    return {
      tipo: alumno_contactos_tipo.TUTOR,
      orden,
      parentesco: tutor.parentesco?.trim() || null,
      nombre: tutor.nombre.trim(),
      telefono: tutor.telefono.trim(),
      direccion: tutor.direccion?.trim() || null,
      fecha_nacimiento: null,
    };
  }

  private mapEmergenciaAContacto(
    contacto: ContactoEmergenciaCreateAlumnoDto,
    orden: number,
  ): Prisma.alumno_contactosUncheckedCreateWithoutAlumnosInput {
    return {
      tipo: alumno_contactos_tipo.EMERGENCIA,
      orden,
      parentesco: contacto.parentesco?.trim() || null,
      nombre: contacto.nombre.trim(),
      telefono: contacto.telefono.trim(),
      direccion: contacto.direccion?.trim() || null,
      fecha_nacimiento: contacto.fechaNacimiento
        ? new Date(contacto.fechaNacimiento)
        : null,
    };
  }

  private buildContactos(
    createAlumnoDto: CreateAlumnoDto,
  ): Prisma.alumno_contactosUncheckedCreateWithoutAlumnosInput[] {
    const tutores = (createAlumnoDto.tutores ?? []).map((tutor, index) =>
      this.mapTutorAContacto(tutor, index + 1),
    );

    const emergencias = (createAlumnoDto.contactosEmergencia ?? []).map(
      (contacto, index) => this.mapEmergenciaAContacto(contacto, index + 1),
    );

    return [...tutores, ...emergencias];
  }

  private mapAlumno(alumno: AlumnoWithRelations): AlumnoResponse {
    return {
      id: alumno.id.toString(),
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      fechaNacimiento: this.mapDate(alumno.fecha_nacimiento),
      tipoSangre: this.mapTipoSangre(alumno.tipo_sangre),
      estado: alumno.estado,
      grupo: alumno.grupos
        ? {
            id: alumno.grupos.id,
            nombre: alumno.grupos.nombre,
            colorId: alumno.grupos.colores.id,
            colorNombre: alumno.grupos.colores.nombre,
            colorHex: alumno.grupos.colores.valor_hex,
          }
        : null,
      pulsera: alumno.pulseras
        ? {
            id: alumno.pulseras.id.toString(),
            uuid: alumno.pulseras.uuid,
            estado: alumno.pulseras.estado,
            lastSeenAt: this.mapDate(alumno.pulseras.last_seen_at),
          }
        : null,
      contactos: alumno.alumno_contactos.map((contacto) => ({
        tipo: contacto.tipo,
        orden: contacto.orden,
        parentesco: contacto.parentesco,
        nombre: contacto.nombre,
        telefono: contacto.telefono,
        fechaNacimiento: this.mapDate(contacto.fecha_nacimiento),
        direccion: contacto.direccion,
        esTutor: contacto.tipo === alumno_contactos_tipo.TUTOR,
      })),
    };
  }

  async create(createAlumnoDto: CreateAlumnoDto): Promise<AlumnoResponse> {
    const pulseraId = this.parseBigIntId(
      createAlumnoDto.pulseraId,
      'pulseraId',
    );
    const contactos = this.buildContactos(createAlumnoDto);

    const alumnoCreado = (await this.prisma.$transaction(async (tx) => {
      const pulsera = await tx.pulseras.findUnique({
        where: { id: pulseraId },
        select: {
          id: true,
          estado: true,
        },
      });

      if (!pulsera) {
        throw new NotFoundException(
          `No existe pulsera con id ${createAlumnoDto.pulseraId}`,
        );
      }

      if (pulsera.estado !== pulseras_estado.CONECTADA) {
        throw new BadRequestException(
          'La pulsera seleccionada no está en estado CONECTADA',
        );
      }

      const alumnoVinculado = await tx.alumnos.findFirst({
        where: {
          pulsera_id: pulseraId,
        },
        select: {
          id: true,
        },
      });

      if (alumnoVinculado) {
        throw new ConflictException(
          'La pulsera seleccionada ya está vinculada a un alumno',
        );
      }

      const nuevoAlumno = await tx.alumnos.create({
        data: {
          nombre: createAlumnoDto.nombre.trim(),
          apellido: createAlumnoDto.apellido.trim(),
          fecha_nacimiento: createAlumnoDto.fechaNacimiento
            ? new Date(createAlumnoDto.fechaNacimiento)
            : null,
          tipo_sangre: this.mapTipoSangreInput(createAlumnoDto.tipoSangre),
          pulsera_id: pulseraId,
          alumno_contactos:
            contactos.length > 0
              ? {
                  create: contactos,
                }
              : undefined,
        },
        select: ALUMNO_SELECT,
      });

      await tx.pulseras.update({
        where: {
          id: pulseraId,
        },
        data: {
          estado: pulseras_estado.REGISTRADA,
        },
      });

      return nuevoAlumno;
    })) as AlumnoWithRelations;

    return this.mapAlumno(alumnoCreado);
  }

  async findAll(): Promise<AlumnoResponse[]> {
    const alumnos = (await this.prisma.alumnos.findMany({
      select: ALUMNO_SELECT,
      orderBy: {
        id: 'asc',
      },
    })) as AlumnoWithRelations[];

    return alumnos.map((alumno) => this.mapAlumno(alumno));
  }

  async findByGrupoId(grupoId: number): Promise<AlumnoResponse[]> {
    const alumnos = (await this.prisma.alumnos.findMany({
      select: ALUMNO_SELECT,
      where: {
        grupo_id: grupoId,
      },
      orderBy: {
        id: 'asc',
      },
    })) as AlumnoWithRelations[];

    return alumnos.map((alumno) => this.mapAlumno(alumno));
  }

  async findOne(id: number): Promise<AlumnoResponse> {
    const alumno = (await this.prisma.alumnos.findUnique({
      select: ALUMNO_SELECT,
      where: {
        id: BigInt(id),
      },
    })) as AlumnoWithRelations | null;

    if (!alumno) {
      throw new NotFoundException(`No existe alumno con id ${id}`);
    }

    return this.mapAlumno(alumno);
  }

  async assignToGrupo(id: number, grupoId: number): Promise<AlumnoResponse> {
    const grupo = await this.prisma.grupos.findUnique({
      where: { id: grupoId },
      select: { id: true },
    });

    if (!grupo) {
      throw new NotFoundException(`No existe grupo con id ${grupoId}`);
    }

    const alumnoId = BigInt(id);
    const alumnoExistente = await this.prisma.alumnos.findUnique({
      where: { id: alumnoId },
      select: { id: true },
    });

    if (!alumnoExistente) {
      throw new NotFoundException(`No existe alumno con id ${id}`);
    }

    const alumnoActualizado = (await this.prisma.alumnos.update({
      where: {
        id: alumnoId,
      },
      data: {
        grupo_id: grupoId,
      },
      select: ALUMNO_SELECT,
    })) as AlumnoWithRelations;

    return this.mapAlumno(alumnoActualizado);
  }
}
