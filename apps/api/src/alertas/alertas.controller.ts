import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtCookieAuthGuard } from '../auth/guards/jwt-cookie-auth.guard';
import type { AuthJwtPayload } from '../auth/auth.types';
import { AlertasService } from './alertas.service';
import { FindAlertasQueryDto } from './dto/find-alertas-query.dto';

@Controller('alertas')
@UseGuards(JwtCookieAuthGuard)
export class AlertasController {
  constructor(private readonly alertasService: AlertasService) {}

  @Get()
  findAll(@Query() query: FindAlertasQueryDto) {
    return this.alertasService.findAll(query.resuelta);
  }

  @Patch(':id/resolver')
  resolver(
    @Param('id') id: string,
    @Req() request: Request & { user: AuthJwtPayload },
  ) {
    return this.alertasService.resolver(id, BigInt(request.user.sub));
  }
}
