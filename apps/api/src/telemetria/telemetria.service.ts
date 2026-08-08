import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TimescaleService } from '../../prisma/timescale.service';
import { PulseraTelemetriaDto } from './dto/pulsera-telemetria.dto';
import { TelemetriaGateway } from './telemetria.gateway';

const THROTTLE_MS = 5000;

@Injectable()
export class TelemetriaService {
  private readonly logger = new Logger(TelemetriaService.name);
  private readonly ultimaEscritura = new Map<bigint, Date>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly timescale: TimescaleService,
    private readonly gateway: TelemetriaGateway,
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
    const ultimaVez = this.ultimaEscritura.get(alumnoId);
    if (ultimaVez && ahora.getTime() - ultimaVez.getTime() < THROTTLE_MS) {
      return;
    }

    const beaconId = dto.area === -1 ? null : dto.area;

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

    await this.timescale.$executeRaw`
      INSERT INTO telemetria (time, mac_address, alumno_id, beacon_id, bpm, spo2, temperatura)
      VALUES (now(), ${dto.mac}, ${alumnoId}, ${beaconId}, ${dto.bpm}, ${dto.spo2}, ${dto.temp})
    `;

    this.ultimaEscritura.set(alumnoId, ahora);

    this.logger.log(
      `Telemetría guardada: alumno=${alumnoId} mac=${dto.mac} bpm=${dto.bpm} spo2=${dto.spo2} temp=${dto.temp} beacon=${beaconId ?? 'N/A'}`,
    );
  }
}
