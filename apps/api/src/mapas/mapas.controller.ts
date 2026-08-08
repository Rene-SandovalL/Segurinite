import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
import { CreateMapaDto } from './dto/create-mapa.dto';
import { MapasService } from './mapas.service';

// Debe coincidir con la config del bucket "mapas" en Supabase Storage
// (file_size_limit / allowed_mime_types).
const TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024;
const MIME_TYPES_PERMITIDOS = ['image/png', 'image/jpeg', 'image/webp'];

@Controller('mapas')
@UseGuards(JwtCookieAuthGuard)
export class MapasController {
  constructor(private readonly mapasService: MapasService) {}

  @Post()
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
  upload(
    @UploadedFile() archivo: Express.Multer.File,
    @Body() createMapaDto: CreateMapaDto,
  ) {
    return this.mapasService.upload(archivo, createMapaDto);
  }

  @Get()
  findAll() {
    return this.mapasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mapasService.findOne(id);
  }
}
