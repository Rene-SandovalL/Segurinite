import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { pulseras_estado } from '../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RegistrarPulseraDto } from './dto/registrar-pulsera.dto';
import { UpdatePulseraConfigDto } from './dto/update-pulsera-config.dto';

export interface PulseraConectadaResponse {
  id: string;
  identificador: string;
  uuid: string;
  estado: pulseras_estado;
  conectada: boolean;
}

export interface PulseraResponse {
  id: string;
  uuid: string;
  alias: string | null;
  estado: pulseras_estado;
  macAddress: string | null;
  bateria: number | null;
  lastSeenAt: Date | null;
}

@Injectable()
export class PulserasService {
  constructor(private readonly prisma: PrismaService) {}

  private mapPulsera(pulsera: {
    id: bigint;
    uuid: string;
    alias: string | null;
    estado: pulseras_estado;
    mac_address: string | null;
    bateria: number | null;
    last_seen_at: Date | null;
  }): PulseraResponse {
    return {
      id: pulsera.id.toString(),
      uuid: pulsera.uuid,
      alias: pulsera.alias,
      estado: pulsera.estado,
      macAddress: pulsera.mac_address,
      bateria: pulsera.bateria,
      lastSeenAt: pulsera.last_seen_at,
    };
  }

  async findConectadasDisponibles(): Promise<PulseraConectadaResponse[]> {
    const pulseras = await this.prisma.pulseras.findMany({
      where: {
        estado: pulseras_estado.CONECTADA,
        alumnos: null,
      },
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        uuid: true,
        mac_address: true,
        estado: true,
      },
    });

    return pulseras.map((pulsera) => ({
      id: pulsera.id.toString(),
      identificador: pulsera.mac_address ?? pulsera.uuid,
      uuid: pulsera.uuid,
      estado: pulsera.estado,
      conectada: pulsera.estado === pulseras_estado.CONECTADA,
    }));
  }

  async findAll(): Promise<PulseraResponse[]> {
    const pulseras = await this.prisma.pulseras.findMany({
      orderBy: { id: 'asc' },
    });

    return pulseras.map((pulsera) => this.mapPulsera(pulsera));
  }

  /**
   * Pulseras listas para asignarse a un alumno nuevo: ya reportaron su
   * mac_address real (CONECTADA) y todavía no están vinculadas a nadie.
   * El filtro por mac_address is-not-null es defensivo — por diseño toda
   * pulsera CONECTADA ya tiene mac_address, pero evita listar una fila
   * inconsistente si algún dato quedó mal cargado.
   */
  async findDisponibles(): Promise<PulseraResponse[]> {
    const pulseras = await this.prisma.pulseras.findMany({
      where: {
        estado: pulseras_estado.CONECTADA,
        mac_address: { not: null },
        alumnos: null,
      },
      orderBy: { id: 'asc' },
    });

    return pulseras.map((pulsera) => this.mapPulsera(pulsera));
  }

  async registrarDesdeSerial(
    registrarPulseraDto: RegistrarPulseraDto,
  ): Promise<PulseraResponse> {
    const macEnUso = await this.prisma.pulseras.findUnique({
      where: { mac_address: registrarPulseraDto.macAddress },
      select: { id: true },
    });

    if (macEnUso) {
      throw new ConflictException(
        'Ya existe una pulsera registrada con esa mac_address',
      );
    }

    const pulsera = await this.prisma.pulseras.create({
      data: {
        uuid: randomUUID(),
        mac_address: registrarPulseraDto.macAddress,
        alias: registrarPulseraDto.alias ?? null,
        estado: pulseras_estado.CONECTADA,
      },
    });

    return this.mapPulsera(pulsera);
  }

  async updateConfiguracion(
    id: bigint,
    updatePulseraConfigDto: UpdatePulseraConfigDto,
  ): Promise<PulseraResponse> {
    const pulsera = await this.prisma.pulseras.findUnique({ where: { id } });

    if (!pulsera) {
      throw new NotFoundException(`No existe pulsera con id ${id}`);
    }

    const actualizada = await this.prisma.pulseras.update({
      where: { id },
      data: {
        alias: updatePulseraConfigDto.alias,
        estado: updatePulseraConfigDto.estado,
      },
    });

    return this.mapPulsera(actualizada);
  }
}
