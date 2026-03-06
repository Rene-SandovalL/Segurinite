import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GruposService } from './grupos.service';
import { GruposController } from './grupos.controller';
import { Grupo } from './entities/grupo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Grupo]), // ← Registra el repositorio
  ],
  controllers: [GruposController],
  providers: [GruposService],
})
export class GruposModule {}
