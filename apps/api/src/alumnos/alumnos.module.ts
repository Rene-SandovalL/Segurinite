import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlumnosService } from './alumnos.service';
import { AlumnosController } from './alumnos.controller';
import { Alumno } from './entities/alumno.entity';
import { Grupo } from '../grupos/entities/grupo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alumno, Grupo]), // ← Registra los repositorios
  ],
  controllers: [AlumnosController],
  providers: [AlumnosService],
})
export class AlumnosModule {}
