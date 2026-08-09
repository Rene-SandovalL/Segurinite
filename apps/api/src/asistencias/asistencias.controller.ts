import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtCookieAuthGuard } from '../auth/guards/jwt-cookie-auth.guard';
import { AsistenciasService } from './asistencias.service';
import { FindAsistenciasQueryDto } from './dto/find-asistencias-query.dto';

@Controller('asistencias')
@UseGuards(JwtCookieAuthGuard)
export class AsistenciasController {
  constructor(private readonly asistenciasService: AsistenciasService) {}

  @Get()
  findAll(@Query() query: FindAsistenciasQueryDto) {
    return this.asistenciasService.findByGrupoAndFecha(
      query.grupoId,
      query.fecha,
    );
  }
}
