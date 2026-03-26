import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ColoresService } from './colores.service';
import { CreateColorDto } from './dto/create-color.dto';
import { JwtCookieAuthGuard } from '../auth/guards/jwt-cookie-auth.guard';

@Controller('colores')
@UseGuards(JwtCookieAuthGuard)
export class ColoresController {
  constructor(private readonly coloresService: ColoresService) {}

  @Get()
  findAll() {
    return this.coloresService.findAll();
  }

  @Post()
  create(@Body() createColorDto: CreateColorDto) {
    return this.coloresService.create(createColorDto);
  }
}
