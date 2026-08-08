import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

const FOTO_BUCKET = 'usuarios';
const FOTO_SUBCARPETA = 'docentes';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  async subirFoto(
    id: number,
    file: Express.Multer.File | undefined,
  ): Promise<{ fotoUrl: string }> {
    if (!file) {
      throw new BadRequestException('Falta el archivo de la foto');
    }

    const usuarioId = BigInt(id);
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
      select: { foto_url: true },
    });

    if (!usuario) {
      throw new NotFoundException(`No existe usuario con id ${id}`);
    }

    if (usuario.foto_url) {
      await this.eliminarArchivoFoto(usuario.foto_url);
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

    await this.prisma.usuarios.update({
      where: { id: usuarioId },
      data: { foto_url: publicUrl },
    });

    return { fotoUrl: publicUrl };
  }

  async eliminarFoto(id: number): Promise<{ fotoUrl: null }> {
    const usuarioId = BigInt(id);
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
      select: { foto_url: true },
    });

    if (!usuario) {
      throw new NotFoundException(`No existe usuario con id ${id}`);
    }

    if (usuario.foto_url) {
      await this.eliminarArchivoFoto(usuario.foto_url);
    }

    await this.prisma.usuarios.update({
      where: { id: usuarioId },
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
}
