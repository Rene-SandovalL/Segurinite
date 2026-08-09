import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { asistencia_estado } from '../generated/prisma/client';
import { EstadisticasQueryDto } from './dto/estadisticas-query.dto';
import { aFechaIso, resolverRango } from './rango-fechas.util';

export interface AsistenciaPorGrupoResponse {
  grupoId: number;
  grupoNombre: string;
  colorHex: string;
  totalAlumnos: number;
  /** totalAlumnos × díasContados — el denominador de todos los porcentajes. */
  totalPosible: number;
  presentes: number;
  tardanzas: number;
  ausentes: number;
  /** (presentes + tardanzas) / totalPosible, redondeado a 1 decimal. */
  porcentajeAsistencia: number;
}

export interface RankingFaltasResponse {
  alumnoId: string;
  nombre: string;
  grupoId: number | null;
  grupoNombre: string | null;
  faltas: number;
  diasContados: number;
}

export interface EstadisticasAsistenciaResponse {
  rango: { fechaInicio: string; fechaFin: string; diasContados: number };
  grupos: AsistenciaPorGrupoResponse[];
  /** Totales agregados de todos los grupos — alimenta el gráfico de dona. */
  totales: {
    presentes: number;
    tardanzas: number;
    ausentes: number;
    porcentajeAsistencia: number;
  };
}

const ASISTIO: asistencia_estado[] = [
  asistencia_estado.PRESENTE,
  asistencia_estado.TARDANZA,
];

@Injectable()
export class EstadisticasAsistenciaService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Asistencia por grupo dentro del rango. El denominador es
   * (alumnos del grupo × días contados), así que un alumno sin fila ese día
   * cuenta como ausente sin necesidad de que exista la fila — misma
   * convención de "AUSENTE implícito" que usa GET /asistencias.
   *
   * Nota: la atribución de alumno→grupo usa el grupo ACTUAL del alumno, no el
   * que tenía el día de la asistencia (no guardamos histórico de cambios de
   * grupo).
   */
  async porGrupo(
    query: EstadisticasQueryDto,
  ): Promise<EstadisticasAsistenciaResponse> {
    const rango = resolverRango(query);

    const grupos = await this.prisma.grupos.findMany({
      where: query.grupoId ? { id: query.grupoId } : undefined,
      select: {
        id: true,
        nombre: true,
        colores: { select: { valor_hex: true } },
        _count: { select: { alumnos: true } },
      },
      orderBy: { nombre: 'asc' },
    });

    const filas = await this.prisma.asistencias.findMany({
      where: {
        fecha: { gte: rango.dateInicio, lte: rango.dateFin },
        estado: { in: ASISTIO },
        alumnos: query.grupoId ? { grupo_id: query.grupoId } : undefined,
      },
      select: {
        estado: true,
        fecha: true,
        alumnos: { select: { grupo_id: true } },
      },
    });

    const conteoPorGrupo = new Map<
      number,
      { presentes: number; tardanzas: number }
    >();

    for (const fila of filas) {
      const grupoId = fila.alumnos.grupo_id;
      if (grupoId === null) {
        continue;
      }

      // Numerador y denominador tienen que filtrarse contra el MISMO set de
      // días; si no, el porcentaje deja de tener sentido.
      if (!rango.diasContadosSet.has(aFechaIso(fila.fecha))) {
        continue;
      }

      const acumulado = conteoPorGrupo.get(grupoId) ?? {
        presentes: 0,
        tardanzas: 0,
      };

      if (fila.estado === asistencia_estado.PRESENTE) {
        acumulado.presentes += 1;
      } else {
        acumulado.tardanzas += 1;
      }

      conteoPorGrupo.set(grupoId, acumulado);
    }

    const resultado = grupos.map((grupo) => {
      const conteo = conteoPorGrupo.get(grupo.id) ?? {
        presentes: 0,
        tardanzas: 0,
      };
      const totalPosible = grupo._count.alumnos * rango.diasContados;
      const asistidos = conteo.presentes + conteo.tardanzas;

      return {
        grupoId: grupo.id,
        grupoNombre: grupo.nombre,
        colorHex: grupo.colores.valor_hex,
        totalAlumnos: grupo._count.alumnos,
        totalPosible,
        presentes: conteo.presentes,
        tardanzas: conteo.tardanzas,
        ausentes: Math.max(0, totalPosible - asistidos),
        porcentajeAsistencia: this.porcentaje(asistidos, totalPosible),
      };
    });

    const totales = resultado.reduce(
      (acumulado, grupo) => ({
        presentes: acumulado.presentes + grupo.presentes,
        tardanzas: acumulado.tardanzas + grupo.tardanzas,
        ausentes: acumulado.ausentes + grupo.ausentes,
        totalPosible: acumulado.totalPosible + grupo.totalPosible,
      }),
      { presentes: 0, tardanzas: 0, ausentes: 0, totalPosible: 0 },
    );

    return {
      rango: {
        fechaInicio: rango.fechaInicio,
        fechaFin: rango.fechaFin,
        diasContados: rango.diasContados,
      },
      grupos: resultado,
      totales: {
        presentes: totales.presentes,
        tardanzas: totales.tardanzas,
        ausentes: totales.ausentes,
        porcentajeAsistencia: this.porcentaje(
          totales.presentes + totales.tardanzas,
          totales.totalPosible,
        ),
      },
    };
  }

  /** Top 10 alumnos con más faltas: días contados del rango − días asistidos. */
  async rankingFaltas(
    query: EstadisticasQueryDto,
  ): Promise<RankingFaltasResponse[]> {
    const rango = resolverRango(query);

    const alumnos = await this.prisma.alumnos.findMany({
      where: query.grupoId ? { grupo_id: query.grupoId } : undefined,
      select: {
        id: true,
        nombre: true,
        apellido: true,
        grupos: { select: { id: true, nombre: true } },
        asistencias: {
          where: {
            fecha: { gte: rango.dateInicio, lte: rango.dateFin },
            estado: { in: ASISTIO },
          },
          select: { fecha: true },
        },
      },
    });

    return alumnos
      .map((alumno) => {
        // Mismo criterio que porGrupo: el mismo set de días.
        const diasAsistidos = alumno.asistencias.filter((asistencia) =>
          rango.diasContadosSet.has(aFechaIso(asistencia.fecha)),
        ).length;

        return {
          alumnoId: alumno.id.toString(),
          nombre: `${alumno.nombre} ${alumno.apellido}`,
          grupoId: alumno.grupos?.id ?? null,
          grupoNombre: alumno.grupos?.nombre ?? null,
          faltas: Math.max(0, rango.diasContados - diasAsistidos),
          diasContados: rango.diasContados,
        };
      })
      .filter((alumno) => alumno.faltas > 0)
      .sort((a, b) => b.faltas - a.faltas || a.nombre.localeCompare(b.nombre))
      .slice(0, 10);
  }

  private porcentaje(parte: number, total: number): number {
    if (total <= 0) {
      return 0;
    }

    return Math.round((parte / total) * 1000) / 10;
  }
}
