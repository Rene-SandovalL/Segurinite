import { Module } from '@nestjs/common';
import { ConfiguracionModule } from '../configuracion/configuracion.module';
import { TelemetriaGateway } from './telemetria.gateway';
import { TelemetriaMqttClient } from './telemetria-mqtt.client';
import { TelemetriaService } from './telemetria.service';
import { SinSenalCronService } from './sin-senal-cron.service';

@Module({
  imports: [ConfiguracionModule],
  providers: [
    TelemetriaService,
    TelemetriaMqttClient,
    TelemetriaGateway,
    SinSenalCronService,
  ],
})
export class TelemetriaModule {}
