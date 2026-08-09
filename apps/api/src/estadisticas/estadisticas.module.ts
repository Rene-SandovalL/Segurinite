import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EstadisticasAlertasService } from './estadisticas-alertas.service';
import { EstadisticasAsistenciaService } from './estadisticas-asistencia.service';
import { EstadisticasTelemetriaService } from './estadisticas-telemetria.service';
import { EstadisticasController } from './estadisticas.controller';

@Module({
  imports: [AuthModule],
  controllers: [EstadisticasController],
  providers: [
    EstadisticasAsistenciaService,
    EstadisticasAlertasService,
    EstadisticasTelemetriaService,
  ],
})
export class EstadisticasModule {}
