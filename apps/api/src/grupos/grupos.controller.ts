import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { AlumnosService } from '../alumnos/alumnos.service';

@Controller('grupos')
export class GruposController {
  constructor(
    private readonly gruposService: GruposService,
    private readonly alumnosService: AlumnosService,
  ) {}

  @Get()
  findAll() {
    return this.gruposService.findAll();
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
