import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  alumno_contactos_tipo,
  alumnos_tipo_sangre,
  Prisma,
} from '../generated/prisma/client';

interface AlumnoWithRelations {
  id: bigint;
  nombre: string;
  apellido: string;
  fecha_nacimiento: Date | null;
  tipo_sangre: alumnos_tipo_sangre | null;
  estado: 'normal' | 'alerta' | 'peligro';
  grupos: {
    id: number;
    nombre: string;
    color: 'blue' | 'coral' | 'green' | 'grey';
  } | null;
  pulseras: {
    uuid: string;
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
  estado: 'normal' | 'alerta' | 'peligro';
  grupo: {
    id: number;
    nombre: string;
    color: 'blue' | 'coral' | 'green' | 'grey';
  } | null;
  pulsera: {
    uuid: string;
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
      color: true,
    },
  },
  pulseras: {
    select: {
      uuid: true,
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
            color: alumno.grupos.color,
          }
        : null,
      pulsera: alumno.pulseras
        ? {
            uuid: alumno.pulseras.uuid,
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
}
