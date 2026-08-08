import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtCookieAuthGuard } from '../auth/guards/jwt-cookie-auth.guard';
import { ZonasService } from './zonas.service';

@Controller('zonas')
@UseGuards(JwtCookieAuthGuard)
export class ZonasController {
  constructor(private readonly zonasService: ZonasService) {}

  @Get()
  findAll() {
    return this.zonasService.findAll();
  }
}
