import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { alerta_severidad, alerta_tipo } from '../generated/prisma/client';

export interface TelemetriaUpdateEvento {
  alumnoId: string;
  beaconId: number | null;
  bpm: number;
  spo2: number;
  temp: number;
}

export interface AlertaNuevaEvento {
  alumnoId: string;
  tipo: alerta_tipo;
  severidad: alerta_severidad;
  /** true SOLO para TEMP_ANOMALA y SIN_SENAL — dispara la "súper alerta" en el frontend. */
  esCritica: boolean;
}

@WebSocketGateway({
  cors: {
    origin: process.env.WEB_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  },
})
export class TelemetriaGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(TelemetriaGateway.name);

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Cliente WS conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente WS desconectado: ${client.id}`);
  }

  emitTelemetriaUpdate(evento: TelemetriaUpdateEvento) {
    this.server.emit('telemetria:update', evento);
    this.logger.log(
      `Emitido telemetria:update alumno=${evento.alumnoId} beacon=${evento.beaconId ?? 'N/A'} bpm=${evento.bpm} spo2=${evento.spo2} temp=${evento.temp}`,
    );
  }

  emitAlertaNueva(evento: AlertaNuevaEvento) {
    this.server.emit('alerta:nueva', evento);
    this.logger.warn(
      `Emitido alerta:nueva alumno=${evento.alumnoId} tipo=${evento.tipo} severidad=${evento.severidad} esCritica=${evento.esCritica}`,
    );
  }
}
