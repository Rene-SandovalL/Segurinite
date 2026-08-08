import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AlumnosService } from './alumnos.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { JwtCookieAuthGuard } from '../auth/guards/jwt-cookie-auth.guard';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';

// Debe coincidir con la config del bucket "usuarios" en Supabase Storage
// (file_size_limit / allowed_mime_types).
const TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024;
const MIME_TYPES_PERMITIDOS = ['image/png', 'image/jpeg', 'image/webp'];

@Controller('alumnos')
@UseGuards(JwtCookieAuthGuard)
export class AlumnosController {
  constructor(private readonly alumnosService: AlumnosService) {}

  @Get()
  findAll() {
    return this.alumnosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.alumnosService.findOne(id);
  }

  @Post()
  create(@Body() createAlumnoDto: CreateAlumnoDto) {
    return this.alumnosService.create(createAlumnoDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAlumnoDto: UpdateAlumnoDto,
  ) {
    return this.alumnosService.update(id, updateAlumnoDto);
  }

  @Patch(':id/grupo/:grupoId')
  assignToGrupo(
    @Param('id', ParseIntPipe) id: number,
    @Param('grupoId', ParseIntPipe) grupoId: number,
  ) {
    return this.alumnosService.assignToGrupo(id, grupoId);
  }

  @Patch(':id/grupo')
  updateGrupo(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { grupoId?: number | null },
  ) {
    if (body.grupoId === undefined) {
      throw new BadRequestException(
        'grupoId es requerido y puede ser un numero o null',
      );
    }

    return this.alumnosService.updateGrupo(id, body.grupoId);
  }

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
    return this.alumnosService.subirFoto(id, archivo);
  }

  @Delete(':id/foto')
  eliminarFoto(@Param('id', ParseIntPipe) id: number) {
    return this.alumnosService.eliminarFoto(id);
  }
}
