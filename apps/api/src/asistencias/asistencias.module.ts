import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AsistenciasController } from './asistencias.controller';
import { AsistenciasService } from './asistencias.service';

@Module({
  imports: [AuthModule],
  controllers: [AsistenciasController],
  providers: [AsistenciasService],
})
export class AsistenciasModule {}
