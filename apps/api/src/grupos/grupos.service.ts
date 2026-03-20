import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AlumnosService } from '../alumnos/alumnos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';

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
        colores: {
          select: {
            id: true,
            nombre: true,
            valor_hex: true,
          },
        },
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
      color: {
        id: grupo.colores.id,
        nombre: grupo.colores.nombre,
        valorHex: grupo.colores.valor_hex,
      },
      totalAlumnos: grupo._count.alumnos,
    }));
  }

  async create(createGrupoDto: CreateGrupoDto) {
    const nombre = createGrupoDto.nombre.trim();

    if (!nombre) {
      throw new BadRequestException('El nombre del grupo es obligatorio');
    }

    const grupoConMismoNombre = await this.prisma.grupos.findUnique({
      where: {
        nombre,
      },
      select: {
        id: true,
      },
    });

    if (grupoConMismoNombre) {
      throw new ConflictException('Ya existe un grupo con ese nombre');
    }

    const color = await this.prisma.colores.findUnique({
      where: {
        id: createGrupoDto.colorId,
      },
      select: {
        id: true,
      },
    });

    if (!color) {
      throw new NotFoundException(
        `No existe color con id ${createGrupoDto.colorId}`,
      );
    }

    const colorEnUso = await this.prisma.grupos.findFirst({
      where: {
        color_id: createGrupoDto.colorId,
      },
      select: {
        id: true,
      },
    });

    if (colorEnUso) {
      throw new ConflictException('El color seleccionado ya está en uso');
    }

    const grupo = await this.prisma.grupos.create({
      data: {
        nombre,
        color_id: createGrupoDto.colorId,
      },
      include: {
        colores: {
          select: {
            id: true,
            nombre: true,
            valor_hex: true,
          },
        },
        _count: {
          select: {
            alumnos: true,
          },
        },
      },
    });

    return {
      id: grupo.id,
      nombre: grupo.nombre,
      color: {
        id: grupo.colores.id,
        nombre: grupo.colores.nombre,
        valorHex: grupo.colores.valor_hex,
      },
      totalAlumnos: grupo._count.alumnos,
    };
  }

  async findOne(id: number) {
    const grupo = await this.prisma.grupos.findUnique({
      where: { id },
      include: {
        colores: {
          select: {
            id: true,
            nombre: true,
            valor_hex: true,
          },
        },
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
      color: {
        id: grupo.colores.id,
        nombre: grupo.colores.nombre,
        valorHex: grupo.colores.valor_hex,
      },
      totalAlumnos: grupo._count.alumnos,
    };
  }

  async findAlumnosByGrupoId(grupoId: number): Promise<unknown[]> {
    await this.findOne(grupoId);

    return this.alumnosService.findByGrupoId(grupoId);
  }
}
