import { Module } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { GruposController } from './grupos.controller';

@Module({
  imports: [],
  controllers: [GruposController],
  providers: [GruposService],
})
export class GruposModule {}
