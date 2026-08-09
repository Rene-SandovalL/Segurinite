import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Prisma,
  alerta_severidad,
  alerta_tipo,
  usuarios_rol,
} from '../generated/prisma/client';

interface AlertaConRelaciones {
  id: bigint;
  tipo: alerta_tipo;
  severidad: alerta_severidad;
  created_at: Date;
  resuelta_at: Date | null;
  notas: string | null;
  alumnos: {
    id: bigint;
    nombre: string;
    apellido: string;
    grupos: { id: number; nombre: string } | null;
  };
  usuarios: {
    email: string;
    rol: usuarios_rol;
    docentes: { nombre: string } | null;
  } | null;
}

export interface AlertaResponse {
  id: string;
  alumnoId: string;
  alumnoNombre: string;
  grupoId: number | null;
  grupoNombre: string | null;
  tipo: alerta_tipo;
  severidad: alerta_severidad;
  createdAt: string;
  resuelta: boolean;
  resueltaAt: string | null;
  resueltaPor: {
    nombre: string;
    rol: usuarios_rol;
  } | null;
  notas: string | null;
}

const ALERTA_SELECT = {
  id: true,
  tipo: true,
  severidad: true,
  created_at: true,
  resuelta_at: true,
  notas: true,
  alumnos: {
    select: {
      id: true,
      nombre: true,
      apellido: true,
      grupos: {
        select: { id: true, nombre: true },
      },
    },
  },
  usuarios: {
    select: {
      email: true,
      rol: true,
      docentes: {
        select: { nombre: true },
      },
    },
  },
} satisfies Prisma.alertasSelect;

@Injectable()
export class AlertasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(resuelta?: boolean): Promise<AlertaResponse[]> {
    const where: Prisma.alertasWhereInput =
      resuelta === undefined
        ? {}
        : resuelta
          ? { resuelta_at: { not: null } }
          : { resuelta_at: null };

    const alertas = (await this.prisma.alertas.findMany({
      where,
      orderBy: { created_at: 'desc' },
      select: ALERTA_SELECT,
    })) as AlertaConRelaciones[];

    return alertas.map((alerta) => this.mapAlerta(alerta));
  }

  async resolver(id: string, usuarioId: bigint): Promise<AlertaResponse> {
    const alertaId = this.parseBigIntId(id);

    const alerta = await this.prisma.alertas.findUnique({
      where: { id: alertaId },
      select: { id: true, resuelta_at: true },
    });

    if (!alerta) {
      throw new NotFoundException(`No existe alerta con id ${id}`);
    }

    if (alerta.resuelta_at) {
      throw new ConflictException('La alerta ya está resuelta');
    }

    const actualizada = (await this.prisma.alertas.update({
      where: { id: alertaId },
      data: {
        resuelta_at: new Date(),
        resuelta_por: usuarioId,
      },
      select: ALERTA_SELECT,
    })) as AlertaConRelaciones;

    return this.mapAlerta(actualizada);
  }

  private parseBigIntId(value: string): bigint {
    try {
      const parsed = BigInt(value);

      if (parsed <= 0n) {
        throw new Error('id no válido');
      }

      return parsed;
    } catch {
      throw new BadRequestException('id debe ser un entero positivo');
    }
  }

  private mapAlerta(alerta: AlertaConRelaciones): AlertaResponse {
    let resueltaPor: { nombre: string; rol: usuarios_rol } | null = null;

    if (alerta.usuarios) {
      const nombre =
        alerta.usuarios.rol === usuarios_rol.DOCENTE && alerta.usuarios.docentes
          ? alerta.usuarios.docentes.nombre
          : alerta.usuarios.email;

      resueltaPor = { nombre, rol: alerta.usuarios.rol };
    }

    return {
      id: alerta.id.toString(),
      alumnoId: alerta.alumnos.id.toString(),
      alumnoNombre: `${alerta.alumnos.nombre} ${alerta.alumnos.apellido}`,
      grupoId: alerta.alumnos.grupos?.id ?? null,
      grupoNombre: alerta.alumnos.grupos?.nombre ?? null,
      tipo: alerta.tipo,
      severidad: alerta.severidad,
      createdAt: alerta.created_at.toISOString(),
      resuelta: alerta.resuelta_at !== null,
      resueltaAt: alerta.resuelta_at ? alerta.resuelta_at.toISOString() : null,
      resueltaPor,
      notas: alerta.notas,
    };
  }
}
