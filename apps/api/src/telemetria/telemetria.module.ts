import { Module } from '@nestjs/common';
import { TelemetriaMqttClient } from './telemetria-mqtt.client';
import { TelemetriaService } from './telemetria.service';

@Module({
  providers: [TelemetriaService, TelemetriaMqttClient],
})
export class TelemetriaModule {}
