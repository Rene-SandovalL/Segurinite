import { Module } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { GruposController } from './grupos.controller';
import { AlumnosModule } from '../alumnos/alumnos.module';

@Module({
  imports: [AlumnosModule],
  controllers: [GruposController],
  providers: [GruposService],
})
export class GruposModule {}
