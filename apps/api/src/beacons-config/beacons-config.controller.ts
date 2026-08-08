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
import { BeaconsService } from '../beacons/beacons.service';
import { RegistrarBeaconDto } from '../beacons/dto/registrar-beacon.dto';
import { UpdateBeaconConfigDto } from '../beacons/dto/update-beacon-config.dto';
import { BeaconSerialService } from './beacons-config.service';
import { ConnectPuertoDto } from './dto/connect-puerto.dto';
import { SetBeaconIdDto } from './dto/set-beacon-id.dto';

@Controller('beacons-config')
@UseGuards(JwtCookieAuthGuard)
export class BeaconsConfigController {
  constructor(
    private readonly beaconSerialService: BeaconSerialService,
    private readonly beaconsService: BeaconsService,
  ) {}

  @Get('ports')
  listPorts() {
    return this.beaconSerialService.listPorts();
  }

  @Post('connect')
  connect(@Body() connectPuertoDto: ConnectPuertoDto) {
    return this.beaconSerialService.connect(connectPuertoDto.path);
  }

  @Post('disconnect')
  disconnect() {
    return this.beaconSerialService.disconnect();
  }

  @Get('id')
  getId() {
    return this.beaconSerialService.getId();
  }

  @Post('id')
  setId(@Body() setBeaconIdDto: SetBeaconIdDto) {
    return this.beaconSerialService.setId(setBeaconIdDto.id);
  }

  @Post('registrar')
  registrar(@Body() registrarBeaconDto: RegistrarBeaconDto) {
    return this.beaconsService.upsertPorBeaconId(registrarBeaconDto);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBeaconConfigDto: UpdateBeaconConfigDto,
  ) {
    return this.beaconsService.updateConfiguracion(id, updateBeaconConfigDto);
  }
}
