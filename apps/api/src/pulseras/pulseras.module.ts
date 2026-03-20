import { Module } from '@nestjs/common';
import { PulserasController } from './pulseras.controller';
import { PulserasService } from './pulseras.service';

@Module({
  controllers: [PulserasController],
  providers: [PulserasService],
  exports: [PulserasService],
})
export class PulserasModule {}
