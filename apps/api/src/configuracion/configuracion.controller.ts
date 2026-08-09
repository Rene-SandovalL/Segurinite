import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtCookieAuthGuard } from '../auth/guards/jwt-cookie-auth.guard';
import { ConfiguracionService } from './configuracion.service';
import { UpdateConfiguracionAlertasDto } from './dto/update-configuracion-alertas.dto';
import { UpdateConfiguracionHorarioDto } from './dto/update-configuracion-horario.dto';

@Controller('configuracion')
@UseGuards(JwtCookieAuthGuard)
export class ConfiguracionController {
  constructor(private readonly configuracionService: ConfiguracionService) {}

  @Get('horario')
  getHorario() {
    return this.configuracionService.getHorario();
  }

  @Patch('horario')
  updateHorario(@Body() dto: UpdateConfiguracionHorarioDto) {
    return this.configuracionService.updateHorario(dto);
  }

  @Get('alertas')
  getAlertas() {
    return this.configuracionService.getAlertas();
  }

  @Patch('alertas')
  updateAlertas(@Body() dto: UpdateConfiguracionAlertasDto) {
    return this.configuracionService.updateAlertas(dto);
  }
}
