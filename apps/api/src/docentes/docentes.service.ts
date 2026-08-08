import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { PrismaService } from '../../prisma/prisma.service';
import type { docentes } from '../generated/prisma/client';
import { SupabaseService } from '../supabase/supabase.service';

const FOTO_BUCKET = 'usuarios';
const FOTO_SUBCARPETA = 'docentes';

export interface DocenteResponse {
  id: number;
  nombre: string;
  fechaNacimiento: string | null;
  rfc: string | null;
  telefono: string | null;
  correo: string | null;
  observaciones: string | null;
  fotoUrl: string | null;
  grupoId: number | null;
}

@Injectable()
export class DocentesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  async findByGrupoId(grupoId: number): Promise<DocenteResponse | null> {
    const docente = await this.prisma.docentes.findUnique({
      where: { grupo_id: grupoId },
    });

    return docente ? this.mapDocente(docente) : null;
  }

  async subirFoto(
    id: number,
    file: Express.Multer.File | undefined,
  ): Promise<{ fotoUrl: string }> {
    if (!file) {
      throw new BadRequestException('Falta el archivo de la foto');
    }

    const docente = await this.prisma.docentes.findUnique({
      where: { id },
      select: { foto_url: true },
    });

    if (!docente) {
      throw new NotFoundException(`No existe docente con id ${id}`);
    }

    if (docente.foto_url) {
      await this.eliminarArchivoFoto(docente.foto_url);
    }

    const extension = extname(file.originalname);
    const nombreArchivo = `${FOTO_SUBCARPETA}/${randomUUID()}${extension}`;

    const { error: errorSubida } = await this.supabase.client.storage
      .from(FOTO_BUCKET)
      .upload(nombreArchivo, file.buffer, { contentType: file.mimetype });

    if (errorSubida) {
      throw new InternalServerErrorException(
        `No se pudo subir la foto: ${errorSubida.message}`,
      );
    }

    const {
      data: { publicUrl },
    } = this.supabase.client.storage
      .from(FOTO_BUCKET)
      .getPublicUrl(nombreArchivo);

    await this.prisma.docentes.update({
      where: { id },
      data: { foto_url: publicUrl },
    });

    return { fotoUrl: publicUrl };
  }

  async eliminarFoto(id: number): Promise<{ fotoUrl: null }> {
    const docente = await this.prisma.docentes.findUnique({
      where: { id },
      select: { foto_url: true },
    });

    if (!docente) {
      throw new NotFoundException(`No existe docente con id ${id}`);
    }

    if (docente.foto_url) {
      await this.eliminarArchivoFoto(docente.foto_url);
    }

    await this.prisma.docentes.update({
      where: { id },
      data: { foto_url: null },
    });

    return { fotoUrl: null };
  }

  private async eliminarArchivoFoto(fotoUrl: string): Promise<void> {
    const marcador = `/object/public/${FOTO_BUCKET}/`;
    const index = fotoUrl.indexOf(marcador);

    if (index === -1) {
      return;
    }

    const path = fotoUrl.slice(index + marcador.length);
    await this.supabase.client.storage.from(FOTO_BUCKET).remove([path]);
  }

  private mapDocente(docente: docentes): DocenteResponse {
    return {
      id: docente.id,
      nombre: docente.nombre,
      fechaNacimiento: docente.fecha_nacimiento
        ? docente.fecha_nacimiento.toISOString()
        : null,
      rfc: docente.rfc,
      telefono: docente.telefono,
      correo: docente.correo,
      observaciones: docente.observaciones,
      fotoUrl: docente.foto_url,
      grupoId: docente.grupo_id,
    };
  }
}
