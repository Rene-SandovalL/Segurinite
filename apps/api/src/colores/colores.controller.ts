import { Body, Controller, Get, Post } from '@nestjs/common';
import { ColoresService } from './colores.service';
import { CreateColorDto } from './dto/create-color.dto';

@Controller('colores')
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
