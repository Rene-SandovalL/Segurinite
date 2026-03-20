import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateColorDto } from './dto/create-color.dto';

export interface ColorResponse {
  id: number;
  nombre: string | null;
  valorHex: string;
  ocupado: boolean;
}

@Injectable()
export class ColoresService {
  constructor(private readonly prisma: PrismaService) {}

  private mapColor(color: {
    id: number;
    nombre: string | null;
    valor_hex: string;
    grupos: { id: number } | null;
  }): ColorResponse {
    return {
      id: color.id,
      nombre: color.nombre,
      valorHex: color.valor_hex,
      ocupado: Boolean(color.grupos),
    };
  }

  async findAll(): Promise<ColorResponse[]> {
    const colores = await this.prisma.colores.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        grupos: {
          select: {
            id: true,
          },
        },
      },
    });

    return colores.map((color) => this.mapColor(color));
  }

  async create(createColorDto: CreateColorDto): Promise<ColorResponse> {
    const valorHex = createColorDto.valorHex.trim().toUpperCase();

    const existente = await this.prisma.colores.findUnique({
      where: {
        valor_hex: valorHex,
      },
      select: {
        id: true,
      },
    });

    if (existente) {
      throw new ConflictException(
        'Ya existe un color con ese valor hexadecimal',
      );
    }

    const color = await this.prisma.colores.create({
      data: {
        nombre: createColorDto.nombre?.trim() || null,
        valor_hex: valorHex,
      },
      include: {
        grupos: {
          select: {
            id: true,
          },
        },
      },
    });

    return this.mapColor(color);
  }
}
