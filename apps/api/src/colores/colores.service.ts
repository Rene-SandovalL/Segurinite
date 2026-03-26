import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateColorDto } from './dto/create-color.dto';

const PALETA_GRUPOS_BASE = [
  { nombre: 'Azul', valorHex: '#575EAA' },
  { nombre: 'Coral', valorHex: '#FF7043' },
  { nombre: 'Verde', valorHex: '#2E7D32' },
  { nombre: 'Gris', valorHex: '#37474F' },
  { nombre: 'Rojo', valorHex: '#E53935' },
  { nombre: 'Naranja', valorHex: '#FB8C00' },
  { nombre: 'Amarillo', valorHex: '#FDD835' },
  { nombre: 'Lima', valorHex: '#C0CA33' },
  { nombre: 'Menta', valorHex: '#66BB6A' },
  { nombre: 'Turquesa', valorHex: '#26A69A' },
  { nombre: 'Cian', valorHex: '#00ACC1' },
  { nombre: 'Celeste', valorHex: '#42A5F5' },
  { nombre: 'Indigo', valorHex: '#3949AB' },
  { nombre: 'Violeta', valorHex: '#7E57C2' },
  { nombre: 'Morado', valorHex: '#8E24AA' },
  { nombre: 'Rosa', valorHex: '#EC407A' },
  { nombre: 'Magenta', valorHex: '#D81B60' },
  { nombre: 'Cafe', valorHex: '#6D4C41' },
  { nombre: 'Pizarra', valorHex: '#546E7A' },
  { nombre: 'Negro', valorHex: '#263238' },
] as const;

export interface ColorResponse {
  id: number;
  nombre: string | null;
  valorHex: string;
  ocupado: boolean;
}

@Injectable()
export class ColoresService {
  constructor(private readonly prisma: PrismaService) {}

  private async asegurarPaletaBase(): Promise<void> {
    await this.prisma.colores.createMany({
      data: PALETA_GRUPOS_BASE.map((color) => ({
        nombre: color.nombre,
        valor_hex: color.valorHex,
      })),
      skipDuplicates: true,
    });
  }

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
    await this.asegurarPaletaBase();

    const colores = await this.prisma.colores.findMany({
      where: {
        valor_hex: {
          in: PALETA_GRUPOS_BASE.map((color) => color.valorHex),
        },
      },
      include: {
        grupos: {
          select: {
            id: true,
          },
        },
      },
    });

    const colorPorHex = new Map(
      colores.map((color) => [color.valor_hex.toUpperCase(), color]),
    );

    const respuesta: ColorResponse[] = [];

    for (const colorBase of PALETA_GRUPOS_BASE) {
      const color = colorPorHex.get(colorBase.valorHex);

      if (!color) {
        continue;
      }

      respuesta.push(this.mapColor(color));
    }

    return respuesta;
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
