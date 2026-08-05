import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import mqtt, { MqttClient } from 'mqtt';
import { PulseraTelemetriaDto } from './dto/pulsera-telemetria.dto';
import { TelemetriaService } from './telemetria.service';

const TOPIC_TELEMETRIA = 'patients/+/vitals';

@Injectable()
export class TelemetriaMqttClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelemetriaMqttClient.name);
  private client!: MqttClient;

  constructor(private readonly telemetriaService: TelemetriaService) {}

  onModuleInit() {
    const brokerUrl = process.env.MQTT_BROKER_URL ?? 'mqtt://localhost:1883';
    this.client = mqtt.connect(brokerUrl);

    this.client.on('connect', () => {
      this.logger.log(`Conectado al broker MQTT en ${brokerUrl}`);
      this.client.subscribe(TOPIC_TELEMETRIA, (err) => {
        if (err) {
          this.logger.error(
            `No se pudo suscribir a ${TOPIC_TELEMETRIA}: ${err.message}`,
          );
        }
      });
    });

    this.client.on('error', (err) => {
      this.logger.error(`Error de conexión MQTT: ${err.message}`);
    });

    this.client.on('message', (topic, payload) => {
      void this.handleMessage(topic, payload);
    });
  }

  onModuleDestroy() {
    this.client?.end();
  }

  private async handleMessage(topic: string, payload: Buffer): Promise<void> {
    let parsed: unknown;
    try {
      parsed = JSON.parse(payload.toString());
    } catch {
      this.logger.warn(
        `Payload no es JSON válido en ${topic}: ${payload.toString()}`,
      );
      return;
    }

    const dto = plainToInstance(PulseraTelemetriaDto, parsed);
    const errores = await validate(dto);
    if (errores.length > 0) {
      this.logger.warn(
        `Payload inválido en ${topic}: ${errores.map((e) => Object.values(e.constraints ?? {}).join(', ')).join(' | ')}`,
      );
      return;
    }

    try {
      await this.telemetriaService.procesarTelemetria(dto);
    } catch (err) {
      this.logger.error(
        `Error procesando telemetría de ${topic}: ${(err as Error).message}`,
      );
    }
  }
}
