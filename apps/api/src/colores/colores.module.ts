import { Module } from '@nestjs/common';
import { ColoresController } from './colores.controller';
import { ColoresService } from './colores.service';

@Module({
  controllers: [ColoresController],
  providers: [ColoresService],
  exports: [ColoresService],
})
export class ColoresModule {}
