import { Injectable } from '@nestjs/common';

import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';

@Injectable()
export class AlumnosService {
  create(createAlumnoDto: CreateAlumnoDto) {}

  findAll() {}

  findOne(id: number) {}

  update(id: number, updateAlumnoDto: UpdateAlumnoDto) {

  }

  remove(id: number) {

  }
}
