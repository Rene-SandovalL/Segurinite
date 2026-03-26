import { Controller, Get, UseGuards } from '@nestjs/common';
import { PulserasService } from './pulseras.service';
import { JwtCookieAuthGuard } from '../auth/guards/jwt-cookie-auth.guard';

@Controller('pulseras')
@UseGuards(JwtCookieAuthGuard)
export class PulserasController {
  constructor(private readonly pulserasService: PulserasService) {}

  @Get('conectadas')
  findConectadas() {
    return this.pulserasService.findConectadasDisponibles();
  }
}
