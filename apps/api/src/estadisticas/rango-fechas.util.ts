import { DateTime } from 'luxon';
import { ZONA_HORARIA_ESCUELA } from '../telemetria/asistencia-horario.util';

/** Rango por defecto cuando no se mandan fechaInicio/fechaFin. */
const DIAS_POR_DEFECTO = 7;

export interface RangoResuelto {
  /** 'YYYY-MM-DD' en hora local de la escuela. */
  fechaInicio: string;
  fechaFin: string;
  /**
   * Medianoche UTC de cada extremo — para comparar contra columnas DATE
   * (asistencias.fecha), que se escriben con esa misma convención.
   */
  dateInicio: Date;
  dateFin: Date;
  /**
   * Instantes UTC reales del arranque del primer día y del final del último,
   * en hora local de la escuela — para columnas de timestamp
   * (alertas.created_at, telemetria.time).
   */
  instanteInicio: Date;
  instanteFin: Date;
  /**
   * Cuántos días del rango cuentan como día de clases — hoy, todos los del
   * rango (fines de semana incluidos). Es el denominador de los porcentajes
   * de asistencia.
   *
   * Si en el futuro se quiere excluir fines de semana o días feriados, este
   * es el ÚNICO lugar que hay que tocar: basta con no agregar esos días a
   * `diasContadosSet`, y numerador y denominador siguen cuadrando solos
   * porque ambos se filtran contra el mismo set.
   */
  diasContados: number;
  /** Los días que cuentan, como 'YYYY-MM-DD'. */
  diasContadosSet: Set<string>;
  /** Todos los días del rango como 'YYYY-MM-DD'. */
  dias: string[];
}

/** Fecha de una columna DATE de Postgres → 'YYYY-MM-DD'. */
export function aFechaIso(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

/**
 * Traduce los filtros de fecha de la query a todas las representaciones que
 * necesitan las consultas. Todo se interpreta en ZONA_HORARIA_ESCUELA para
 * que "los últimos 7 días" signifique lo mismo que ve un admin en pantalla.
 */
export function resolverRango(filtros: {
  fechaInicio?: string;
  fechaFin?: string;
}): RangoResuelto {
  const hoy = DateTime.now().setZone(ZONA_HORARIA_ESCUELA).startOf('day');

  const fin = filtros.fechaFin
    ? DateTime.fromISO(filtros.fechaFin, {
        zone: ZONA_HORARIA_ESCUELA,
      }).startOf('day')
    : hoy;

  const inicio = filtros.fechaInicio
    ? DateTime.fromISO(filtros.fechaInicio, {
        zone: ZONA_HORARIA_ESCUELA,
      }).startOf('day')
    : fin.minus({ days: DIAS_POR_DEFECTO - 1 });

  const dias: string[] = [];
  const diasContadosSet = new Set<string>();

  for (let cursor = inicio; cursor <= fin; cursor = cursor.plus({ days: 1 })) {
    const dia = cursor.toISODate()!;
    dias.push(dia);
    diasContadosSet.add(dia);
  }

  return {
    fechaInicio: inicio.toISODate()!,
    fechaFin: fin.toISODate()!,
    dateInicio: new Date(inicio.toISODate()!),
    dateFin: new Date(fin.toISODate()!),
    instanteInicio: inicio.toJSDate(),
    instanteFin: fin.endOf('day').toJSDate(),
    diasContados: diasContadosSet.size,
    diasContadosSet,
    dias,
  };
}

/** Límites UTC de un solo día local de la escuela. */
export function limitesDelDia(fecha?: string): {
  fecha: string;
  inicio: Date;
  fin: Date;
} {
  const dia = fecha
    ? DateTime.fromISO(fecha, { zone: ZONA_HORARIA_ESCUELA }).startOf('day')
    : DateTime.now().setZone(ZONA_HORARIA_ESCUELA).startOf('day');

  return {
    fecha: dia.toISODate()!,
    inicio: dia.toJSDate(),
    fin: dia.endOf('day').toJSDate(),
  };
}
