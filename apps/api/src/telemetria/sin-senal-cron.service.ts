import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { alerta_severidad, alerta_tipo } from '../generated/prisma/client';
import { ConfiguracionCacheService } from '../configuracion/configuracion-cache.service';
import { TelemetriaGateway } from './telemetria.gateway';

/**
 * Cada 15s revisa alumnos con pulsera asignada cuya pulsera no reporta hace
 * más del umbral configurado (sinSenalSegundos, ver ConfiguracionCacheService)
 * y les abre una alerta SIN_SENAL (si no hay ya una sin resolver).
 * A propósito NO se auto-resuelve cuando vuelve a llegar telemetría — eso lo
 * hace un humano desde el historial, para dejar registro de la desconexión.
 */
@Injectable()
export class SinSenalCronService {
  private readonly logger = new Logger(SinSenalCronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: TelemetriaGateway,
    private readonly configCache: ConfiguracionCacheService,
  ) {}

  @Cron('*/15 * * * * *')
  async revisarPulserasSinSenal(): Promise<void> {
    const { sinSenalSegundos } = this.configCache.getAlertas();
    const limite = new Date(Date.now() - sinSenalSegundos * 1000);

    const alumnosSinSenal = await this.prisma.alumnos.findMany({
      where: {
        pulsera_id: { not: null },
        pulseras: { last_seen_at: { lt: limite } },
      },
      select: { id: true },
    });

    for (const alumno of alumnosSinSenal) {
      const yaExisteAlertaAbierta = await this.prisma.alertas.findFirst({
        where: {
          alumno_id: alumno.id,
          tipo: alerta_tipo.SIN_SENAL,
          resuelta_at: null,
        },
        select: { id: true },
      });

      if (yaExisteAlertaAbierta) {
        continue;
      }

      await this.prisma.alertas.create({
        data: {
          alumno_id: alumno.id,
          tipo: alerta_tipo.SIN_SENAL,
          severidad: alerta_severidad.PELIGRO,
        },
      });

      this.gateway.emitAlertaNueva({
        alumnoId: alumno.id.toString(),
        tipo: alerta_tipo.SIN_SENAL,
        severidad: alerta_severidad.PELIGRO,
        esCritica: true,
      });

      this.logger.warn(`Alerta SIN_SENAL creada: alumno=${alumno.id}`);
    }
  }
}
