import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  configuracion_alertas,
  configuracion_horario,
} from '../generated/prisma/client';

export interface ConfiguracionHorarioCache {
  horaEntrada: string;
  horaSalida: string;
  toleranciaTardanzaMinutos: number;
}

export interface ConfiguracionAlertasCache {
  tempAlertaMin: number;
  tempNormalMin: number;
  tempNormalMax: number;
  tempAlertaMax: number;
  bpmAlto: number;
  contadorTemp: number;
  contadorVitalCero: number;
  contadorFueraZona: number;
  sinSenalSegundos: number;
}

/**
 * Cachea en memoria las dos configuraciones de fila única (horario y
 * alertas) para que TelemetriaService y SinSenalCronService no consulten la
 * DB en cada mensaje MQTT (llega uno cada ~3s por pulsera) por un valor que
 * casi nunca cambia. Se carga una vez en OnModuleInit y ConfiguracionService
 * la actualiza en memoria inmediatamente después de cada PATCH exitoso.
 */
@Injectable()
export class ConfiguracionCacheService implements OnModuleInit {
  private readonly logger = new Logger(ConfiguracionCacheService.name);
  private horario!: ConfiguracionHorarioCache;
  private alertas!: ConfiguracionAlertasCache;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    const [horarioRow, alertasRow] = await Promise.all([
      this.prisma.configuracion_horario.findUniqueOrThrow({
        where: { id: 1 },
      }),
      this.prisma.configuracion_alertas.findUniqueOrThrow({
        where: { id: 1 },
      }),
    ]);

    this.horario = this.mapHorario(horarioRow);
    this.alertas = this.mapAlertas(alertasRow);

    this.logger.log('Configuración de horario y alertas cargada en memoria');
  }

  getHorario(): ConfiguracionHorarioCache {
    return this.horario;
  }

  getAlertas(): ConfiguracionAlertasCache {
    return this.alertas;
  }

  actualizarHorario(row: configuracion_horario): void {
    this.horario = this.mapHorario(row);
  }

  actualizarAlertas(row: configuracion_alertas): void {
    this.alertas = this.mapAlertas(row);
  }

  private mapHorario(row: configuracion_horario): ConfiguracionHorarioCache {
    return {
      horaEntrada: this.formatHora(row.hora_entrada),
      horaSalida: this.formatHora(row.hora_salida),
      toleranciaTardanzaMinutos: row.tolerancia_tardanza_minutos,
    };
  }

  private mapAlertas(row: configuracion_alertas): ConfiguracionAlertasCache {
    return {
      tempAlertaMin: row.temp_alerta_min.toNumber(),
      tempNormalMin: row.temp_normal_min.toNumber(),
      tempNormalMax: row.temp_normal_max.toNumber(),
      tempAlertaMax: row.temp_alerta_max.toNumber(),
      bpmAlto: row.bpm_alto,
      contadorTemp: row.contador_temp,
      contadorVitalCero: row.contador_vital_cero,
      contadorFueraZona: row.contador_fuera_zona,
      sinSenalSegundos: row.sin_senal_segundos,
    };
  }

  private formatHora(value: Date): string {
    const horas = value.getUTCHours().toString().padStart(2, '0');
    const minutos = value.getUTCMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }
}
