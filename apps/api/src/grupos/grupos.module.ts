import { Module } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { GruposController } from './grupos.controller';
import { AlumnosModule } from '../alumnos/alumnos.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AlumnosModule, AuthModule],
  controllers: [GruposController],
  providers: [GruposService],
})
export class GruposModule {}
