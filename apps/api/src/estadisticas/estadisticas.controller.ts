import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtCookieAuthGuard } from '../auth/guards/jwt-cookie-auth.guard';
import {
  EstadisticasQueryDto,
  TiempoEnEscuelaQueryDto,
} from './dto/estadisticas-query.dto';
import { EstadisticasAlertasService } from './estadisticas-alertas.service';
import { EstadisticasAsistenciaService } from './estadisticas-asistencia.service';
import { EstadisticasTelemetriaService } from './estadisticas-telemetria.service';

@Controller('estadisticas')
@UseGuards(JwtCookieAuthGuard)
export class EstadisticasController {
  constructor(
    private readonly asistencia: EstadisticasAsistenciaService,
    private readonly alertas: EstadisticasAlertasService,
    private readonly telemetria: EstadisticasTelemetriaService,
  ) {}

  @Get('asistencia')
  asistenciaPorGrupo(@Query() query: EstadisticasQueryDto) {
    return this.asistencia.porGrupo(query);
  }

  @Get('asistencia/ranking-faltas')
  rankingFaltas(@Query() query: EstadisticasQueryDto) {
    return this.asistencia.rankingFaltas(query);
  }

  @Get('alertas/por-tipo')
  alertasPorTipo(@Query() query: EstadisticasQueryDto) {
    return this.alertas.porTipo(query);
  }

  @Get('alertas/por-grupo')
  alertasPorGrupo(@Query() query: EstadisticasQueryDto) {
    return this.alertas.porGrupo(query);
  }

  @Get('alertas/ranking-alumnos')
  alertasRankingAlumnos(@Query() query: EstadisticasQueryDto) {
    return this.alertas.rankingAlumnos(query);
  }

  @Get('alertas/por-severidad')
  alertasPorSeveridad(@Query() query: EstadisticasQueryDto) {
    return this.alertas.porSeveridad(query);
  }

  @Get('alertas/serie-diaria')
  alertasSerieDiaria(@Query() query: EstadisticasQueryDto) {
    return this.alertas.serieDiaria(query);
  }

  @Get('alertas/tiempo-resolucion-promedio')
  alertasTiempoResolucion(@Query() query: EstadisticasQueryDto) {
    return this.alertas.tiempoResolucionPromedio(query);
  }

  @Get('tiempo-en-escuela')
  tiempoEnEscuela(@Query() query: TiempoEnEscuelaQueryDto) {
    return this.telemetria.tiempoEnEscuela(query);
  }

  @Get('vitales-promedio-grupo')
  vitalesPromedioGrupo(@Query() query: EstadisticasQueryDto) {
    return this.telemetria.vitalesPromedioPorGrupo(query);
  }
}
