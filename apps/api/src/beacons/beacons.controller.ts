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
import { BeaconsService } from './beacons.service';
import { CreateBeaconDto } from './dto/create-beacon.dto';
import { UpdateBeaconPosicionDto } from './dto/update-beacon-posicion.dto';

@Controller('beacons')
@UseGuards(JwtCookieAuthGuard)
export class BeaconsController {
  constructor(private readonly beaconsService: BeaconsService) {}

  @Get()
  findAll() {
    return this.beaconsService.findAll();
  }

  @Get('sin-posicion')
  findSinPosicion() {
    return this.beaconsService.findSinPosicion();
  }

  @Post()
  create(@Body() createBeaconDto: CreateBeaconDto) {
    return this.beaconsService.create(createBeaconDto);
  }

  @Patch(':id')
  updatePosicion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBeaconPosicionDto: UpdateBeaconPosicionDto,
  ) {
    return this.beaconsService.updatePosicion(id, updateBeaconPosicionDto);
  }
}
