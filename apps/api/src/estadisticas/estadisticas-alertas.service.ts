import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Prisma,
  alerta_severidad,
  alerta_tipo,
} from '../generated/prisma/client';
import { ZONA_HORARIA_ESCUELA } from '../telemetria/asistencia-horario.util';
import { EstadisticasQueryDto } from './dto/estadisticas-query.dto';
import { resolverRango } from './rango-fechas.util';

export interface ConteoPorTipoResponse {
  tipo: alerta_tipo;
  total: number;
}

export interface ConteoPorGrupoResponse {
  grupoId: number | null;
  grupoNombre: string;
  colorHex: string | null;
  total: number;
}

export interface RankingAlumnosAlertasResponse {
  alumnoId: string;
  nombre: string;
  grupoId: number | null;
  grupoNombre: string | null;
  total: number;
}

export interface ConteoPorSeveridadResponse {
  severidad: alerta_severidad;
  total: number;
}

export interface SerieDiariaResponse {
  fecha: string;
  total: number;
}

export interface TiempoResolucionResponse {
  minutosPromedio: number | null;
  alertasResueltas: number;
}

@Injectable()
export class EstadisticasAlertasService {
  constructor(private readonly prisma: PrismaService) {}

  async porTipo(query: EstadisticasQueryDto): Promise<ConteoPorTipoResponse[]> {
    const agrupado = await this.prisma.alertas.groupBy({
      by: ['tipo'],
      where: this.where(query),
      _count: { _all: true },
    });

    return agrupado
      .map((fila) => ({ tipo: fila.tipo, total: fila._count._all }))
      .sort((a, b) => b.total - a.total);
  }

  async porSeveridad(
    query: EstadisticasQueryDto,
  ): Promise<ConteoPorSeveridadResponse[]> {
    const agrupado = await this.prisma.alertas.groupBy({
      by: ['severidad'],
      where: this.where(query),
      _count: { _all: true },
    });

    return agrupado.map((fila) => ({
      severidad: fila.severidad,
      total: fila._count._all,
    }));
  }

  /**
   * alertas → alumnos → grupos. Se agrega en código en vez de con GROUP BY
   * porque groupBy de Prisma no puede agrupar por un campo de una relación.
   * Los volúmenes son de escala escolar, así que traer las filas del rango y
   * contarlas en memoria es suficiente.
   */
  async porGrupo(
    query: EstadisticasQueryDto,
  ): Promise<ConteoPorGrupoResponse[]> {
    const alertas = await this.prisma.alertas.findMany({
      where: this.where(query),
      select: {
        alumnos: {
          select: {
            grupos: {
              select: {
                id: true,
                nombre: true,
                colores: { select: { valor_hex: true } },
              },
            },
          },
        },
      },
    });

    const conteo = new Map<number | null, ConteoPorGrupoResponse>();

    for (const alerta of alertas) {
      const grupo = alerta.alumnos.grupos;
      const clave = grupo?.id ?? null;

      const acumulado = conteo.get(clave) ?? {
        grupoId: clave,
        grupoNombre: grupo?.nombre ?? 'Sin grupo',
        colorHex: grupo?.colores.valor_hex ?? null,
        total: 0,
      };

      acumulado.total += 1;
      conteo.set(clave, acumulado);
    }

    return [...conteo.values()].sort((a, b) => b.total - a.total);
  }

  async rankingAlumnos(
    query: EstadisticasQueryDto,
  ): Promise<RankingAlumnosAlertasResponse[]> {
    const agrupado = await this.prisma.alertas.groupBy({
      by: ['alumno_id'],
      where: this.where(query),
      _count: { _all: true },
      orderBy: { _count: { alumno_id: 'desc' } },
      take: 10,
    });

    if (agrupado.length === 0) {
      return [];
    }

    const alumnos = await this.prisma.alumnos.findMany({
      where: { id: { in: agrupado.map((fila) => fila.alumno_id) } },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        grupos: { select: { id: true, nombre: true } },
      },
    });

    const alumnosPorId = new Map(
      alumnos.map((alumno) => [alumno.id.toString(), alumno]),
    );

    return agrupado.map((fila) => {
      const alumno = alumnosPorId.get(fila.alumno_id.toString());

      return {
        alumnoId: fila.alumno_id.toString(),
        nombre: alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Desconocido',
        grupoId: alumno?.grupos?.id ?? null,
        grupoNombre: alumno?.grupos?.nombre ?? null,
        total: fila._count._all,
      };
    });
  }

  /**
   * Conteo por día calendario LOCAL de la escuela. created_at es un timestamp
   * naive que guarda instantes UTC, así que hay que convertirlo explícitamente
   * antes de truncar a día — si se truncara en UTC, las alertas de la tarde
   * caerían en el día equivocado.
   *
   * Devuelve todos los días del rango, incluidos los de cero alertas, para que
   * la línea de tiempo del frontend no tenga huecos.
   */
  async serieDiaria(
    query: EstadisticasQueryDto,
  ): Promise<SerieDiariaResponse[]> {
    const rango = resolverRango(query);

    const filtroGrupo = query.grupoId
      ? Prisma.sql`AND al.grupo_id = ${query.grupoId}`
      : Prisma.empty;

    const filas = await this.prisma.$queryRaw<
      { fecha: string; total: bigint }[]
    >`
      SELECT
        to_char(
          (a.created_at AT TIME ZONE 'UTC' AT TIME ZONE ${ZONA_HORARIA_ESCUELA}),
          'YYYY-MM-DD'
        ) AS fecha,
        COUNT(*) AS total
      FROM alertas a
      JOIN alumnos al ON al.id = a.alumno_id
      WHERE a.created_at >= ${rango.instanteInicio}
        AND a.created_at <= ${rango.instanteFin}
        ${filtroGrupo}
      GROUP BY 1
    `;

    const totalPorFecha = new Map(
      filas.map((fila) => [fila.fecha, Number(fila.total)]),
    );

    return rango.dias.map((fecha) => ({
      fecha,
      total: totalPorFecha.get(fecha) ?? 0,
    }));
  }

  async tiempoResolucionPromedio(
    query: EstadisticasQueryDto,
  ): Promise<TiempoResolucionResponse> {
    const where: Prisma.alertasWhereInput = {
      ...this.where(query),
      resuelta_at: { not: null },
    };

    const [agregado, resueltas] = await Promise.all([
      this.prisma.alertas.findMany({
        where,
        select: { created_at: true, resuelta_at: true },
      }),
      this.prisma.alertas.count({ where }),
    ]);

    if (agregado.length === 0) {
      return { minutosPromedio: null, alertasResueltas: 0 };
    }

    const totalMinutos = agregado.reduce((suma, alerta) => {
      const resueltaAt = alerta.resuelta_at!.getTime();
      return suma + (resueltaAt - alerta.created_at.getTime()) / 60000;
    }, 0);

    return {
      minutosPromedio: Math.round((totalMinutos / agregado.length) * 10) / 10,
      alertasResueltas: resueltas,
    };
  }

  /** Filtro común: rango de fechas + grupo opcional (vía la relación alumnos). */
  private where(query: EstadisticasQueryDto): Prisma.alertasWhereInput {
    const rango = resolverRango(query);

    return {
      created_at: { gte: rango.instanteInicio, lte: rango.instanteFin },
      alumnos: query.grupoId ? { grupo_id: query.grupoId } : undefined,
    };
  }
}
