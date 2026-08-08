import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { beacons, colores } from '../generated/prisma/client';
import { CreateBeaconDto } from './dto/create-beacon.dto';
import { UpdateBeaconPosicionDto } from './dto/update-beacon-posicion.dto';
import { RegistrarBeaconDto } from './dto/registrar-beacon.dto';
import { UpdateBeaconConfigDto } from './dto/update-beacon-config.dto';

export interface BeaconResponse {
  id: number;
  beaconId: number;
  zonaId: number;
  mapaId: number | null;
  macAddress: string | null;
  nombre: string | null;
  posX: number | null;
  posY: number | null;
  activo: boolean;
  color: { id: number; nombre: string | null; valorHex: string } | null;
}

type BeaconConColor = beacons & { colores: colores | null };

const INCLUDE_COLOR = { colores: true } as const;

@Injectable()
export class BeaconsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<BeaconResponse[]> {
    const beacons = await this.prisma.beacons.findMany({
      orderBy: { id: 'asc' },
      include: INCLUDE_COLOR,
    });

    return beacons.map((beacon) => this.mapBeacon(beacon));
  }

  async findSinPosicion(): Promise<BeaconResponse[]> {
    const beacons = await this.prisma.beacons.findMany({
      where: { pos_x: null },
      orderBy: { id: 'asc' },
      include: INCLUDE_COLOR,
    });

    return beacons.map((beacon) => this.mapBeacon(beacon));
  }

  private async validarZona(zonaId: number): Promise<void> {
    const zona = await this.prisma.zonas.findUnique({
      where: { id: zonaId },
      select: { id: true },
    });

    if (!zona) {
      throw new NotFoundException(`No existe zona con id ${zonaId}`);
    }
  }

  private async validarColor(colorId: number): Promise<void> {
    const color = await this.prisma.colores.findUnique({
      where: { id: colorId },
      select: { id: true },
    });

    if (!color) {
      throw new NotFoundException(`No existe color con id ${colorId}`);
    }
  }

  private async validarMapa(mapaId: number): Promise<void> {
    const mapa = await this.prisma.mapas.findUnique({
      where: { id: mapaId },
      select: { id: true },
    });

    if (!mapa) {
      throw new NotFoundException(`No existe mapa con id ${mapaId}`);
    }
  }

  async upsertPorBeaconId(
    registrarBeaconDto: RegistrarBeaconDto,
  ): Promise<BeaconResponse> {
    await this.validarZona(registrarBeaconDto.zonaId);

    if (registrarBeaconDto.colorId !== undefined) {
      await this.validarColor(registrarBeaconDto.colorId);
    }

    if (registrarBeaconDto.mapaId !== undefined) {
      await this.validarMapa(registrarBeaconDto.mapaId);
    }

    if (registrarBeaconDto.macAddress) {
      const macEnUso = await this.prisma.beacons.findFirst({
        where: {
          mac_address: registrarBeaconDto.macAddress,
          NOT: { beacon_id: registrarBeaconDto.beaconId },
        },
        select: { id: true },
      });

      if (macEnUso) {
        throw new ConflictException('Ya existe un beacon con esa mac_address');
      }
    }

    const beacon = await this.prisma.beacons.upsert({
      where: { beacon_id: registrarBeaconDto.beaconId },
      create: {
        beacon_id: registrarBeaconDto.beaconId,
        zona_id: registrarBeaconDto.zonaId,
        mapa_id: registrarBeaconDto.mapaId ?? null,
        mac_address: registrarBeaconDto.macAddress ?? null,
        nombre: registrarBeaconDto.nombre ?? null,
        color_id: registrarBeaconDto.colorId ?? null,
      },
      update: {
        zona_id: registrarBeaconDto.zonaId,
        mapa_id: registrarBeaconDto.mapaId ?? null,
        mac_address: registrarBeaconDto.macAddress ?? null,
        nombre: registrarBeaconDto.nombre ?? null,
        color_id: registrarBeaconDto.colorId ?? null,
      },
      include: INCLUDE_COLOR,
    });

    return this.mapBeacon(beacon);
  }

  async updateConfiguracion(
    id: number,
    updateBeaconConfigDto: UpdateBeaconConfigDto,
  ): Promise<BeaconResponse> {
    const beacon = await this.prisma.beacons.findUnique({ where: { id } });

    if (!beacon) {
      throw new NotFoundException(`No existe beacon con id ${id}`);
    }

    if (updateBeaconConfigDto.zonaId !== undefined) {
      await this.validarZona(updateBeaconConfigDto.zonaId);
    }

    if (updateBeaconConfigDto.colorId !== undefined) {
      await this.validarColor(updateBeaconConfigDto.colorId);
    }

    if (updateBeaconConfigDto.mapaId !== undefined) {
      await this.validarMapa(updateBeaconConfigDto.mapaId);
    }

    const actualizado = await this.prisma.beacons.update({
      where: { id },
      data: {
        nombre: updateBeaconConfigDto.nombre,
        zona_id: updateBeaconConfigDto.zonaId,
        color_id: updateBeaconConfigDto.colorId,
        mapa_id: updateBeaconConfigDto.mapaId,
      },
      include: INCLUDE_COLOR,
    });

    return this.mapBeacon(actualizado);
  }

  async create(createBeaconDto: CreateBeaconDto): Promise<BeaconResponse> {
    const zona = await this.prisma.zonas.findUnique({
      where: { id: createBeaconDto.zonaId },
      select: { id: true },
    });

    if (!zona) {
      throw new NotFoundException(
        `No existe zona con id ${createBeaconDto.zonaId}`,
      );
    }

    const beaconExistente = await this.prisma.beacons.findUnique({
      where: { beacon_id: createBeaconDto.beaconId },
      select: { id: true },
    });

    if (beaconExistente) {
      throw new ConflictException(
        `Ya existe un beacon registrado con beacon_id ${createBeaconDto.beaconId}`,
      );
    }

    if (createBeaconDto.macAddress) {
      const macEnUso = await this.prisma.beacons.findUnique({
        where: { mac_address: createBeaconDto.macAddress },
        select: { id: true },
      });

      if (macEnUso) {
        throw new ConflictException('Ya existe un beacon con esa mac_address');
      }
    }

    if (createBeaconDto.colorId !== undefined) {
      const color = await this.prisma.colores.findUnique({
        where: { id: createBeaconDto.colorId },
        select: { id: true },
      });

      if (!color) {
        throw new NotFoundException(
          `No existe color con id ${createBeaconDto.colorId}`,
        );
      }
    }

    const beacon = await this.prisma.beacons.create({
      data: {
        beacon_id: createBeaconDto.beaconId,
        zona_id: createBeaconDto.zonaId,
        mac_address: createBeaconDto.macAddress ?? null,
        nombre: createBeaconDto.nombre ?? null,
        color_id: createBeaconDto.colorId ?? null,
      },
      include: INCLUDE_COLOR,
    });

    return this.mapBeacon(beacon);
  }

  async updatePosicion(
    id: number,
    updateBeaconPosicionDto: UpdateBeaconPosicionDto,
  ): Promise<BeaconResponse> {
    const beacon = await this.prisma.beacons.findUnique({ where: { id } });

    if (!beacon) {
      throw new NotFoundException(`No existe beacon con id ${id}`);
    }

    if (updateBeaconPosicionDto.mapaId !== undefined) {
      const mapa = await this.prisma.mapas.findUnique({
        where: { id: updateBeaconPosicionDto.mapaId },
        select: { id: true },
      });

      if (!mapa) {
        throw new NotFoundException(
          `No existe mapa con id ${updateBeaconPosicionDto.mapaId}`,
        );
      }
    }

    const actualizado = await this.prisma.beacons.update({
      where: { id },
      data: {
        pos_x: updateBeaconPosicionDto.posX,
        pos_y: updateBeaconPosicionDto.posY,
        ...(updateBeaconPosicionDto.mapaId !== undefined && {
          mapa_id: updateBeaconPosicionDto.mapaId,
        }),
      },
      include: INCLUDE_COLOR,
    });

    return this.mapBeacon(actualizado);
  }

  private mapBeacon(beacon: BeaconConColor): BeaconResponse {
    return {
      id: beacon.id,
      beaconId: beacon.beacon_id,
      zonaId: beacon.zona_id,
      mapaId: beacon.mapa_id,
      macAddress: beacon.mac_address,
      nombre: beacon.nombre,
      posX: beacon.pos_x ? beacon.pos_x.toNumber() : null,
      posY: beacon.pos_y ? beacon.pos_y.toNumber() : null,
      activo: beacon.activo,
      color: beacon.colores
        ? {
            id: beacon.colores.id,
            nombre: beacon.colores.nombre,
            valorHex: beacon.colores.valor_hex,
          }
        : null,
    };
  }
}
