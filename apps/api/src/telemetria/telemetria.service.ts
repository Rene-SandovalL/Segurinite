import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TimescaleService } from '../../prisma/timescale.service';
import { alerta_severidad, alerta_tipo } from '../generated/prisma/client';
import { ConfiguracionCacheService } from '../configuracion/configuracion-cache.service';
import { calcularAsistenciaDelMensaje } from './asistencia-horario.util';
import { PulseraTelemetriaDto } from './dto/pulsera-telemetria.dto';
import { TelemetriaGateway } from './telemetria.gateway';

const THROTTLE_MS = 6000;

interface ContadoresAlerta {
  bpmAlto: number;
  vitalCero: number;
  tempAnomala: number;
  fueraDeZona: number;
}

interface EstadoAlumnoTelemetria {
  ultimaEscritura: Date;
  contadores: ContadoresAlerta;
}

interface CondicionAlerta {
  cumple: boolean;
  contador: keyof ContadoresAlerta;
  tipo: alerta_tipo;
  umbral: number;
  valor: number | null;
  severidad: alerta_severidad;
  esCritica: boolean;
}

@Injectable()
export class TelemetriaService {
  private readonly logger = new Logger(TelemetriaService.name);
  private readonly estadoPorAlumno = new Map<bigint, EstadoAlumnoTelemetria>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly timescale: TimescaleService,
    private readonly gateway: TelemetriaGateway,
    private readonly configCache: ConfiguracionCacheService,
  ) {}

  async procesarTelemetria(dto: PulseraTelemetriaDto): Promise<void> {
    const pulsera = await this.prisma.pulseras.findUnique({
      where: { mac_address: dto.mac },
      include: { alumnos: true },
    });

    if (!pulsera) {
      this.logger.warn(`Descartado: no existe pulsera con mac ${dto.mac}`);
      return;
    }

    await this.prisma.pulseras.update({
      where: { id: pulsera.id },
      data: { last_seen_at: new Date() },
    });

    if (!pulsera.alumnos) {
      this.logger.warn(`Descartado: pulsera ${dto.mac} sin alumno asignado`);
      return;
    }

    const alumnoId = pulsera.alumnos.id;
    const ahora = new Date();
    const beaconId = dto.area === -1 ? null : dto.area;

    // La evaluación de alertas corre en CADA mensaje, sin throttle.
    const yaInsertadoPorAlerta = await this.evaluarAlertas(
      dto,
      alumnoId,
      beaconId,
    );

    // El bundle normal (ultimo_*, websocket de mapa, asistencias, hypertable)
    // sí respeta el throttle.
    const estado = this.obtenerOCrearEstado(alumnoId);
    if (ahora.getTime() - estado.ultimaEscritura.getTime() < THROTTLE_MS) {
      return;
    }

    await this.prisma.pulseras.update({
      where: { id: pulsera.id },
      data: {
        ultimo_beacon_id: beaconId,
        ultimo_bpm: dto.bpm,
        ultimo_spo2: dto.spo2,
        ultima_temp: dto.temp,
      },
    });

    this.gateway.emitTelemetriaUpdate({
      alumnoId: alumnoId.toString(),
      beaconId,
      bpm: dto.bpm,
      spo2: dto.spo2,
      temp: dto.temp,
    });

    // Fuera de la ventana hora_entrada–hora_salida (hora local de la
    // escuela) el mensaje no cuenta como asistencia: no crea ni actualiza
    // ninguna fila (last_seen_at de la pulsera, arriba, sí se actualiza
    // siempre, eso no cambia).
    const asistenciaDelMensaje = calcularAsistenciaDelMensaje(
      ahora,
      this.configCache.getHorario(),
    );

    if (asistenciaDelMensaje) {
      const fecha = new Date(asistenciaDelMensaje.fechaLocal);

      await this.prisma.asistencias.upsert({
        where: { alumno_id_fecha: { alumno_id: alumnoId, fecha } },
        create: {
          alumno_id: alumnoId,
          fecha,
          primera_deteccion: ahora,
          ultima_deteccion: ahora,
          estado: asistenciaDelMensaje.estado,
        },
        update: {
          ultima_deteccion: ahora,
        },
      });
    }

    if (!yaInsertadoPorAlerta) {
      await this.insertarTelemetriaHistorica(dto, alumnoId, beaconId);
    }

    estado.ultimaEscritura = ahora;

    this.logger.log(
      `Telemetría guardada: alumno=${alumnoId} mac=${dto.mac} bpm=${dto.bpm} spo2=${dto.spo2} temp=${dto.temp} beacon=${beaconId ?? 'N/A'}`,
    );
  }

  /**
   * Evalúa los 4 contadores de alerta en cada mensaje (sin throttle). Si algún
   * contador llega a su umbral y no hay ya una alerta de ese tipo sin resolver
   * para el alumno, crea la alerta, emite `alerta:nueva` por WebSocket e
   * inserta esa lectura puntual en la hypertable de inmediato (sin esperar el
   * throttle normal). Devuelve true si ya se hizo ese insert inmediato, para
   * que el llamador no lo duplique.
   */
  private async evaluarAlertas(
    dto: PulseraTelemetriaDto,
    alumnoId: bigint,
    beaconId: number | null,
  ): Promise<boolean> {
    const { contadores } = this.obtenerOCrearEstado(alumnoId);
    const umbrales = this.configCache.getAlertas();

    // Temperatura: un solo contador de racha (tempAnomala) para los dos
    // niveles — "cumple" es la unión de ambos rangos anómalos, y qué tan
    // extremo es el valor ACTUAL decide en qué bucket cae si la racha llega
    // al umbral. Sin tope superior/inferior en ninguno de los dos extremos,
    // intencional.
    const tempEsPeligro =
      dto.temp < umbrales.tempAlertaMin || dto.temp > umbrales.tempAlertaMax;

    const condiciones: CondicionAlerta[] = [
      {
        cumple:
          dto.temp < umbrales.tempNormalMin ||
          dto.temp > umbrales.tempNormalMax,
        contador: 'tempAnomala',
        tipo: alerta_tipo.TEMP_ANOMALA,
        umbral: umbrales.contadorTemp,
        valor: dto.temp,
        severidad: tempEsPeligro
          ? alerta_severidad.PELIGRO
          : alerta_severidad.ALERTA,
        esCritica: tempEsPeligro,
      },
      {
        cumple: dto.bpm > umbrales.bpmAlto && dto.bpm !== 0,
        contador: 'bpmAlto',
        tipo: alerta_tipo.BPM_ALTO,
        // No hay un contador propio para la racha de bpm alto en la config —
        // reutiliza contadorVitalCero, con el que ya coincidía en valor (8)
        // antes de este refactor, para preservar el comportamiento actual.
        umbral: umbrales.contadorVitalCero,
        valor: dto.bpm,
        severidad: alerta_severidad.ALERTA,
        esCritica: false,
      },
      {
        cumple: dto.bpm === 0 && dto.spo2 === 0,
        contador: 'vitalCero',
        tipo: alerta_tipo.VITAL_SIN_LECTURA,
        umbral: umbrales.contadorVitalCero,
        valor: null,
        severidad: alerta_severidad.ALERTA,
        esCritica: false,
      },
      {
        cumple: dto.area === -1,
        contador: 'fueraDeZona',
        tipo: alerta_tipo.FUERA_DE_ZONA,
        umbral: umbrales.contadorFueraZona,
        valor: null,
        severidad: alerta_severidad.ALERTA,
        esCritica: false,
      },
    ];

    let yaInsertado = false;

    for (const condicion of condiciones) {
      if (!condicion.cumple) {
        contadores[condicion.contador] = 0;
        continue;
      }

      contadores[condicion.contador] += 1;

      if (contadores[condicion.contador] < condicion.umbral) {
        continue;
      }

      const yaExisteAlertaAbierta = await this.prisma.alertas.findFirst({
        where: {
          alumno_id: alumnoId,
          tipo: condicion.tipo,
          resuelta_at: null,
        },
        select: { id: true },
      });

      if (yaExisteAlertaAbierta) {
        continue;
      }

      const { severidad } = condicion;

      await this.prisma.alertas.create({
        data: {
          alumno_id: alumnoId,
          tipo: condicion.tipo,
          severidad,
          valor: condicion.valor,
          beacon_id: beaconId,
        },
      });

      if (!yaInsertado) {
        await this.insertarTelemetriaHistorica(dto, alumnoId, beaconId);
        yaInsertado = true;
      }

      this.gateway.emitAlertaNueva({
        alumnoId: alumnoId.toString(),
        tipo: condicion.tipo,
        severidad,
        esCritica: condicion.esCritica,
      });

      this.logger.warn(
        `Alerta creada: alumno=${alumnoId} tipo=${condicion.tipo} severidad=${severidad} contador=${contadores[condicion.contador]}`,
      );

      // No se resetea el contador — solo se evita crear otra alerta del
      // mismo tipo mientras la que se acaba de crear siga sin resolver.
    }

    return yaInsertado;
  }

  private async insertarTelemetriaHistorica(
    dto: PulseraTelemetriaDto,
    alumnoId: bigint,
    beaconId: number | null,
  ): Promise<void> {
    await this.timescale.$executeRaw`
      INSERT INTO telemetria (time, mac_address, alumno_id, beacon_id, bpm, spo2, temperatura)
      VALUES (now(), ${dto.mac}, ${alumnoId}, ${beaconId}, ${dto.bpm}, ${dto.spo2}, ${dto.temp})
    `;
  }

  private obtenerOCrearEstado(alumnoId: bigint): EstadoAlumnoTelemetria {
    let estado = this.estadoPorAlumno.get(alumnoId);

    if (!estado) {
      estado = {
        ultimaEscritura: new Date(0),
        contadores: {
          bpmAlto: 0,
          vitalCero: 0,
          tempAnomala: 0,
          fueraDeZona: 0,
        },
      };
      this.estadoPorAlumno.set(alumnoId, estado);
    }

    return estado;
  }
}
