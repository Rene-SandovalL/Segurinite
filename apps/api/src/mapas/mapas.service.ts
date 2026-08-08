import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { PrismaService } from '../../prisma/prisma.service';
import type { mapas } from '../generated/prisma/client';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateMapaDto } from './dto/create-mapa.dto';

const BUCKET = 'mapas';

export interface MapaResponse {
  id: number;
  nombre: string;
  imagenUrl: string;
  createdAt: Date;
}

export interface BeaconEnMapaResponse {
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

export interface MapaConBeaconsResponse extends MapaResponse {
  beacons: BeaconEnMapaResponse[];
}

@Injectable()
export class MapasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  async upload(
    file: Express.Multer.File | undefined,
    createMapaDto: CreateMapaDto,
  ): Promise<MapaResponse> {
    if (!file) {
      throw new BadRequestException('Falta el archivo de imagen del mapa');
    }

    const extension = extname(file.originalname);
    const nombreArchivo = `${randomUUID()}${extension}`;

    const { error: errorSubida } = await this.supabase.client.storage
      .from(BUCKET)
      .upload(nombreArchivo, file.buffer, {
        contentType: file.mimetype,
      });

    if (errorSubida) {
      throw new InternalServerErrorException(
        `No se pudo subir la imagen del mapa: ${errorSubida.message}`,
      );
    }

    const {
      data: { publicUrl },
    } = this.supabase.client.storage.from(BUCKET).getPublicUrl(nombreArchivo);

    const mapa = await this.prisma.mapas.create({
      data: {
        nombre: createMapaDto.nombre,
        imagen_url: publicUrl,
      },
    });

    return this.mapMapa(mapa);
  }

  async findAll(): Promise<MapaResponse[]> {
    const mapas = await this.prisma.mapas.findMany({
      orderBy: { id: 'asc' },
    });

    return mapas.map((mapa) => this.mapMapa(mapa));
  }

  async findOne(id: number): Promise<MapaConBeaconsResponse> {
    const mapa = await this.prisma.mapas.findUnique({
      where: { id },
      include: { beacons: { include: { colores: true } } },
    });

    if (!mapa) {
      throw new NotFoundException(`No existe mapa con id ${id}`);
    }

    return {
      ...this.mapMapa(mapa),
      beacons: mapa.beacons.map((beacon) => ({
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
      })),
    };
  }

  private mapMapa(mapa: mapas): MapaResponse {
    return {
      id: mapa.id,
      nombre: mapa.nombre,
      imagenUrl: mapa.imagen_url,
      createdAt: mapa.created_at,
    };
  }
}
