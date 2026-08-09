import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { asistencia_estado } from '../generated/prisma/client';

export interface AsistenciaResponse {
  alumnoId: string;
  nombre: string;
  estado: asistencia_estado;
  primeraDeteccion: string | null;
}

interface AlumnoConAsistenciaDelDia {
  id: bigint;
  nombre: string;
  apellido: string;
  asistencias: {
    estado: asistencia_estado;
    primera_deteccion: Date | null;
  }[];
}

@Injectable()
export class AsistenciasService {
  constructor(private readonly prisma: PrismaService) {}

  async findByGrupoAndFecha(
    grupoId: number,
    fecha?: string,
  ): Promise<AsistenciaResponse[]> {
    const fechaConsulta = fecha ? this.aFechaUtc(fecha) : this.hoyUtc();

    const alumnos = (await this.prisma.alumnos.findMany({
      where: { grupo_id: grupoId },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        asistencias: {
          where: { fecha: fechaConsulta },
          select: { estado: true, primera_deteccion: true },
          take: 1,
        },
      },
      orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
    })) as AlumnoConAsistenciaDelDia[];

    return alumnos.map((alumno) => {
      const asistencia = alumno.asistencias[0];

      return {
        alumnoId: alumno.id.toString(),
        nombre: `${alumno.nombre} ${alumno.apellido}`,
        // Sin fila para ese día = AUSENTE implícito, nunca se crea la fila
        // solo para reportarlo.
        estado: asistencia?.estado ?? asistencia_estado.AUSENTE,
        primeraDeteccion: asistencia?.primera_deteccion
          ? asistencia.primera_deteccion.toISOString()
          : null,
      };
    });
  }

  private hoyUtc(): Date {
    return new Date(new Date().toISOString().slice(0, 10));
  }

  private aFechaUtc(fecha: string): Date {
    return new Date(fecha);
  }
}
