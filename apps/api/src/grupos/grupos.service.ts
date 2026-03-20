import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AlumnosService } from '../alumnos/alumnos.service';

@Injectable()
export class GruposService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly alumnosService: AlumnosService,
  ) {}

  async findAll() {
    const grupos = await this.prisma.grupos.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        _count: {
          select: {
            alumnos: true,
          },
        },
      },
    });

    return grupos.map((grupo) => ({
      id: grupo.id,
      nombre: grupo.nombre,
      color: grupo.color,
      totalAlumnos: grupo._count.alumnos,
    }));
  }

  async findOne(id: number) {
    const grupo = await this.prisma.grupos.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            alumnos: true,
          },
        },
      },
    });

    if (!grupo) {
      throw new NotFoundException(`No existe grupo con id ${id}`);
    }

    return {
      id: grupo.id,
      nombre: grupo.nombre,
      color: grupo.color,
      totalAlumnos: grupo._count.alumnos,
    };
  }

  async findAlumnosByGrupoId(grupoId: number): Promise<unknown[]> {
    await this.findOne(grupoId);

    return this.alumnosService.findByGrupoId(grupoId);
  }
}
