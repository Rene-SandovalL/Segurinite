import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtCookieAuthGuard } from '../auth/guards/jwt-cookie-auth.guard';
import { UsuariosService } from './usuarios.service';

// Debe coincidir con la config del bucket "usuarios" en Supabase Storage
// (file_size_limit / allowed_mime_types).
const TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024;
const MIME_TYPES_PERMITIDOS = ['image/png', 'image/jpeg', 'image/webp'];

@Controller('usuarios')
@UseGuards(JwtCookieAuthGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post(':id/foto')
  @UseInterceptors(
    FileInterceptor('archivo', {
      storage: memoryStorage(),
      limits: { fileSize: TAMANO_MAXIMO_BYTES },
      fileFilter: (_req, file, callback) => {
        if (!MIME_TYPES_PERMITIDOS.includes(file.mimetype)) {
          callback(
            new BadRequestException(
              `Formato no soportado: ${file.mimetype}. Usa PNG, JPEG o WEBP`,
            ),
            false,
          );
          return;
        }
        callback(null, true);
      },
    }),
  )
  subirFoto(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() archivo: Express.Multer.File,
  ) {
    return this.usuariosService.subirFoto(id, archivo);
  }

  @Delete(':id/foto')
  eliminarFoto(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.eliminarFoto(id);
  }
}
