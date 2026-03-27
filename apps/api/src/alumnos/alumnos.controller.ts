import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AlumnosService } from './alumnos.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { JwtCookieAuthGuard } from '../auth/guards/jwt-cookie-auth.guard';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';

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
}
