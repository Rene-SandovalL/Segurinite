import { Module } from '@nestjs/common';
import { TelemetriaGateway } from './telemetria.gateway';
import { TelemetriaMqttClient } from './telemetria-mqtt.client';
import { TelemetriaService } from './telemetria.service';

@Module({
  providers: [TelemetriaService, TelemetriaMqttClient, TelemetriaGateway],
})
export class TelemetriaModule {}
