import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TimescaleService } from '../../prisma/timescale.service';
import {
  EstadisticasQueryDto,
  TiempoEnEscuelaQueryDto,
} from './dto/estadisticas-query.dto';
import { limitesDelDia, resolverRango } from './rango-fechas.util';

export interface TiempoEnEscuelaResponse {
  alumnoId: string;
  nombre: string;
  grupoId: number | null;
  grupoNombre: string | null;
  primeraLectura: string;
  ultimaLectura: string;
  minutos: number;
}

export interface VitalesPorGrupoResponse {
  grupoId: number | null;
  grupoNombre: string;
  colorHex: string | null;
  alumnosConDatos: number;
  bpmPromedio: number | null;
  tempPromedio: number | null;
}

interface FilaTiempoEnEscuela {
  alumno_id: bigint;
  primera: Date;
  ultima: Date;
}

interface FilaVitales {
  alumno_id: bigint;
  bpm_promedio: unknown;
  temp_promedio: unknown;
}

interface AlumnoResuelto {
  nombre: string;
  grupoId: number | null;
  grupoNombre: string | null;
  colorHex: string | null;
}

/**
 * Estadísticas que cruzan TimescaleDB (telemetría) con Postgres (alumnos y
 * grupos). Son bases SEPARADAS: no existe forma de hacer un JOIN de SQL entre
 * ellas, así que el patrón en todos los métodos de aquí es siempre el mismo —
 * primero se agrega en Timescale por alumno_id, después se resuelven
 * nombre/grupo de esos alumno_id contra Postgres, y el cruce final ocurre en
 * TypeScript.
 */
@Injectable()
export class EstadisticasTelemetriaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly timescale: TimescaleService,
  ) {}

  /** Primera y última lectura de cada alumno en un día, y su diferencia. */
  async tiempoEnEscuela(
    query: TiempoEnEscuelaQueryDto,
  ): Promise<{ fecha: string; alumnos: TiempoEnEscuelaResponse[] }> {
    const dia = limitesDelDia(query.fecha);

    const filas = await this.timescale.$queryRaw<FilaTiempoEnEscuela[]>`
      SELECT alumno_id, MIN(time) AS primera, MAX(time) AS ultima
      FROM telemetria
      WHERE alumno_id IS NOT NULL
        AND time >= ${dia.inicio}
        AND time <= ${dia.fin}
      GROUP BY alumno_id
    `;

    if (filas.length === 0) {
      return { fecha: dia.fecha, alumnos: [] };
    }

    const alumnosPorId = await this.resolverAlumnos(
      filas.map((fila) => fila.alumno_id),
    );

    return {
      fecha: dia.fecha,
      alumnos: filas
        .flatMap((fila) => {
          const alumno = alumnosPorId.get(fila.alumno_id.toString());

          // Telemetría de un alumno que ya no existe en Postgres: se descarta
          // en vez de mostrarse como "Desconocido" en un gráfico de tiempos.
          if (!alumno) {
            return [];
          }

          if (query.grupoId && alumno.grupoId !== query.grupoId) {
            return [];
          }

          const minutos = Math.round(
            (fila.ultima.getTime() - fila.primera.getTime()) / 60000,
          );

          return [
            {
              alumnoId: fila.alumno_id.toString(),
              nombre: alumno.nombre,
              grupoId: alumno.grupoId,
              grupoNombre: alumno.grupoNombre,
              primeraLectura: fila.primera.toISOString(),
              ultimaLectura: fila.ultima.toISOString(),
              minutos,
            },
          ];
        })
        .sort((a, b) => b.minutos - a.minutos),
    };
  }

  /**
   * Promedio de signos vitales por grupo.
   *
   * Se consulta la hypertable cruda y NO el continuous aggregate
   * telemetria_resumen: un `bpm = 0` no significa "pulso cero", significa que
   * el sensor no logró leer (la misma condición que dispara la alerta
   * VITAL_SIN_LECTURA). Esas lecturas son ~44% de la tabla y hunden el
   * promedio de ~74 a ~42 bpm, que no es un valor fisiológicamente creíble.
   * El CAGG ya promedió los ceros dentro de cada bucket de 2 min, así que
   * desde ahí no hay forma de excluirlos.
   *
   * La temperatura no tiene ceros en los datos, pero se filtra igual por
   * simetría y por si un sensor empieza a reportarlos.
   *
   * El promedio de grupo es el promedio simple de los promedios por alumno
   * (cada alumno pesa igual, sin importar cuántas lecturas mandó su pulsera).
   */
  async vitalesPromedioPorGrupo(
    query: EstadisticasQueryDto,
  ): Promise<VitalesPorGrupoResponse[]> {
    const rango = resolverRango(query);

    const filas = await this.timescale.$queryRaw<FilaVitales[]>`
      SELECT
        alumno_id,
        AVG(bpm) FILTER (WHERE bpm > 0) AS bpm_promedio,
        AVG(temperatura) FILTER (WHERE temperatura > 0) AS temp_promedio
      FROM telemetria
      WHERE alumno_id IS NOT NULL
        AND time >= ${rango.instanteInicio}
        AND time <= ${rango.instanteFin}
      GROUP BY alumno_id
    `;

    if (filas.length === 0) {
      return [];
    }

    const alumnosPorId = await this.resolverAlumnos(
      filas.map((fila) => fila.alumno_id),
    );

    const acumuladoPorGrupo = new Map<
      number | null,
      {
        grupoId: number | null;
        grupoNombre: string;
        colorHex: string | null;
        bpm: number[];
        temp: number[];
      }
    >();

    for (const fila of filas) {
      const alumno = alumnosPorId.get(fila.alumno_id.toString());

      if (!alumno) {
        continue;
      }

      if (query.grupoId && alumno.grupoId !== query.grupoId) {
        continue;
      }

      const clave = alumno.grupoId;
      const acumulado = acumuladoPorGrupo.get(clave) ?? {
        grupoId: clave,
        grupoNombre: alumno.grupoNombre ?? 'Sin grupo',
        colorHex: alumno.colorHex,
        bpm: [],
        temp: [],
      };

      const bpm = this.aNumero(fila.bpm_promedio);
      const temp = this.aNumero(fila.temp_promedio);

      if (bpm !== null) {
        acumulado.bpm.push(bpm);
      }
      if (temp !== null) {
        acumulado.temp.push(temp);
      }

      acumuladoPorGrupo.set(clave, acumulado);
    }

    return [...acumuladoPorGrupo.values()]
      .map((grupo) => ({
        grupoId: grupo.grupoId,
        grupoNombre: grupo.grupoNombre,
        colorHex: grupo.colorHex,
        alumnosConDatos: Math.max(grupo.bpm.length, grupo.temp.length),
        bpmPromedio: this.promedio(grupo.bpm, 0),
        tempPromedio: this.promedio(grupo.temp, 1),
      }))
      .sort((a, b) => a.grupoNombre.localeCompare(b.grupoNombre));
  }

  /** Resuelve alumno_id (de Timescale) → nombre y grupo, consultando Postgres. */
  private async resolverAlumnos(
    ids: bigint[],
  ): Promise<Map<string, AlumnoResuelto>> {
    const alumnos = await this.prisma.alumnos.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        grupos: {
          select: {
            id: true,
            nombre: true,
            colores: { select: { valor_hex: true } },
          },
        },
      },
    });

    return new Map(
      alumnos.map((alumno) => [
        alumno.id.toString(),
        {
          nombre: `${alumno.nombre} ${alumno.apellido}`,
          grupoId: alumno.grupos?.id ?? null,
          grupoNombre: alumno.grupos?.nombre ?? null,
          colorHex: alumno.grupos?.colores.valor_hex ?? null,
        },
      ]),
    );
  }

  /** AVG de Postgres vuelve como NUMERIC (string o Decimal según el driver). */
  private aNumero(valor: unknown): number | null {
    if (valor === null || valor === undefined) {
      return null;
    }

    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : null;
  }

  private promedio(valores: number[], decimales: number): number | null {
    if (valores.length === 0) {
      return null;
    }

    const factor = 10 ** decimales;
    const suma = valores.reduce((total, valor) => total + valor, 0);
    return Math.round((suma / valores.length) * factor) / factor;
  }
}
