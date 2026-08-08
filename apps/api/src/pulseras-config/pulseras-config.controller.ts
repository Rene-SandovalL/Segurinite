import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtCookieAuthGuard } from '../auth/guards/jwt-cookie-auth.guard';
import { PulserasService } from '../pulseras/pulseras.service';
import { RegistrarPulseraDto } from '../pulseras/dto/registrar-pulsera.dto';
import { UpdatePulseraConfigDto } from '../pulseras/dto/update-pulsera-config.dto';
import { ConnectPuertoDto } from './dto/connect-puerto.dto';
import { SetMqttDto } from './dto/set-mqtt.dto';
import { SetWifiDto } from './dto/set-wifi.dto';
import { PulseraSerialService } from './pulseras-config.service';

@Controller('pulseras-config')
@UseGuards(JwtCookieAuthGuard)
export class PulserasConfigController {
  constructor(
    private readonly pulseraSerialService: PulseraSerialService,
    private readonly pulserasService: PulserasService,
  ) {}

  @Get('ports')
  listPorts() {
    return this.pulseraSerialService.listPorts();
  }

  @Post('connect')
  connect(@Body() connectPuertoDto: ConnectPuertoDto) {
    return this.pulseraSerialService.connect(connectPuertoDto.path);
  }

  @Post('disconnect')
  disconnect() {
    return this.pulseraSerialService.disconnect();
  }

  @Get('config')
  getConfig() {
    return this.pulseraSerialService.getConfig();
  }

  @Post('wifi')
  setWifi(@Body() setWifiDto: SetWifiDto) {
    return this.pulseraSerialService.setWifi(
      setWifiDto.ssid,
      setWifiDto.password,
    );
  }

  @Post('mqtt')
  setMqtt(@Body() setMqttDto: SetMqttDto) {
    return this.pulseraSerialService.setMqtt(
      setMqttDto.broker,
      setMqttDto.port,
    );
  }

  @Post('registrar')
  registrar(@Body() registrarPulseraDto: RegistrarPulseraDto) {
    return this.pulserasService.registrarDesdeSerial(registrarPulseraDto);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePulseraConfigDto: UpdatePulseraConfigDto,
  ) {
    return this.pulserasService.updateConfiguracion(
      BigInt(id),
      updatePulseraConfigDto,
    );
  }
}
