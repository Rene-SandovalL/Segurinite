import { Controller, Get } from '@nestjs/common';
import { PulserasService } from './pulseras.service';

@Controller('pulseras')
export class PulserasController {
  constructor(private readonly pulserasService: PulserasService) {}

  @Get('conectadas')
  findConectadas() {
    return this.pulserasService.findConectadasDisponibles();
  }
}
