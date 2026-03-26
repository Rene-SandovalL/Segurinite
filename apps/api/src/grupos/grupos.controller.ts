import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GruposService } from './grupos.service';
import { AlumnosService } from '../alumnos/alumnos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { JwtCookieAuthGuard } from '../auth/guards/jwt-cookie-auth.guard';

@Controller('grupos')
@UseGuards(JwtCookieAuthGuard)
export class GruposController {
  constructor(
    private readonly gruposService: GruposService,
    private readonly alumnosService: AlumnosService,
  ) {}

  @Get()
  findAll() {
    return this.gruposService.findAll();
  }

  @Post()
  create(@Body() createGrupoDto: CreateGrupoDto) {
    return this.gruposService.create(createGrupoDto);
  }

  @Get(':grupoId/alumnos')
  findAlumnosByGrupoId(
    @Param('grupoId', ParseIntPipe) grupoId: number,
  ): Promise<unknown[]> {
    return this.alumnosService.findByGrupoId(grupoId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gruposService.findOne(id);
  }
}
