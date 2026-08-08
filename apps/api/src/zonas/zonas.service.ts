import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ZonaResponse {
  id: number;
  nombre: string;
  tipo: string;
  grupo: { id: number; nombre: string } | null;
}

@Injectable()
export class ZonasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ZonaResponse[]> {
    const zonas = await this.prisma.zonas.findMany({
      orderBy: { id: 'asc' },
      include: {
        grupos: {
          select: { id: true, nombre: true },
        },
      },
    });

    return zonas.map((zona) => ({
      id: zona.id,
      nombre: zona.nombre,
      tipo: zona.tipo,
      grupo: zona.grupos
        ? { id: zona.grupos.id, nombre: zona.grupos.nombre }
        : null,
    }));
  }
}
