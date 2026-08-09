import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  configuracion_alertas,
  configuracion_horario,
} from '../generated/prisma/client';
import { ConfiguracionCacheService } from './configuracion-cache.service';
import { UpdateConfiguracionAlertasDto } from './dto/update-configuracion-alertas.dto';
import { UpdateConfiguracionHorarioDto } from './dto/update-configuracion-horario.dto';

export interface ConfiguracionHorarioResponse {
  horaEntrada: string;
  horaSalida: string;
  toleranciaTardanzaMinutos: number;
  updatedAt: string;
}

export interface ConfiguracionAlertasResponse {
  tempAlertaMin: number;
  tempNormalMin: number;
  tempNormalMax: number;
  tempAlertaMax: number;
  bpmAlto: number;
  contadorTemp: number;
  contadorVitalCero: number;
  contadorFueraZona: number;
  sinSenalSegundos: number;
  updatedAt: string;
}

const CONFIGURACION_ID = 1;

@Injectable()
export class ConfiguracionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: ConfiguracionCacheService,
  ) {}

  async getHorario(): Promise<ConfiguracionHorarioResponse> {
    const row = await this.prisma.configuracion_horario.findUniqueOrThrow({
      where: { id: CONFIGURACION_ID },
    });

    return this.mapHorario(row);
  }

  async updateHorario(
    dto: UpdateConfiguracionHorarioDto,
  ): Promise<ConfiguracionHorarioResponse> {
    if (dto.horaEntrada >= dto.horaSalida) {
      throw new BadRequestException(
        'horaEntrada debe ser anterior a horaSalida',
      );
    }

    const row = await this.prisma.configuracion_horario.update({
      where: { id: CONFIGURACION_ID },
      data: {
        hora_entrada: this.parseHora(dto.horaEntrada),
        hora_salida: this.parseHora(dto.horaSalida),
        tolerancia_tardanza_minutos: dto.toleranciaTardanzaMinutos,
      },
    });

    this.cache.actualizarHorario(row);

    return this.mapHorario(row);
  }

  async getAlertas(): Promise<ConfiguracionAlertasResponse> {
    const row = await this.prisma.configuracion_alertas.findUniqueOrThrow({
      where: { id: CONFIGURACION_ID },
    });

    return this.mapAlertas(row);
  }

  async updateAlertas(
    dto: UpdateConfiguracionAlertasDto,
  ): Promise<ConfiguracionAlertasResponse> {
    const ordenValido =
      dto.tempAlertaMin < dto.tempNormalMin &&
      dto.tempNormalMin < dto.tempNormalMax &&
      dto.tempNormalMax < dto.tempAlertaMax;

    if (!ordenValido) {
      throw new BadRequestException(
        'Los umbrales de temperatura deben cumplir tempAlertaMin < tempNormalMin < tempNormalMax < tempAlertaMax',
      );
    }

    const row = await this.prisma.configuracion_alertas.update({
      where: { id: CONFIGURACION_ID },
      data: {
        temp_alerta_min: dto.tempAlertaMin,
        temp_normal_min: dto.tempNormalMin,
        temp_normal_max: dto.tempNormalMax,
        temp_alerta_max: dto.tempAlertaMax,
        bpm_alto: dto.bpmAlto,
        contador_temp: dto.contadorTemp,
        contador_vital_cero: dto.contadorVitalCero,
        contador_fuera_zona: dto.contadorFueraZona,
        sin_senal_segundos: dto.sinSenalSegundos,
      },
    });

    this.cache.actualizarAlertas(row);

    return this.mapAlertas(row);
  }

  private parseHora(valor: string): Date {
    const [horas, minutos] = valor.split(':').map(Number);
    return new Date(Date.UTC(1970, 0, 1, horas, minutos, 0));
  }

  private formatHora(valor: Date): string {
    const horas = valor.getUTCHours().toString().padStart(2, '0');
    const minutos = valor.getUTCMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }

  private mapHorario(row: configuracion_horario): ConfiguracionHorarioResponse {
    return {
      horaEntrada: this.formatHora(row.hora_entrada),
      horaSalida: this.formatHora(row.hora_salida),
      toleranciaTardanzaMinutos: row.tolerancia_tardanza_minutos,
      updatedAt: row.updated_at.toISOString(),
    };
  }

  private mapAlertas(row: configuracion_alertas): ConfiguracionAlertasResponse {
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
      updatedAt: row.updated_at.toISOString(),
    };
  }
}
