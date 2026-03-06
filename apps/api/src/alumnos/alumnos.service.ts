import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alumno } from './entities/alumno.entity';
import { Grupo } from '../grupos/entities/grupo.entity';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';

@Injectable()
export class AlumnosService {
  constructor(
    @InjectRepository(Alumno)
    private readonly alumnoRepository: Repository<Alumno>,

    @InjectRepository(Grupo)
    private readonly grupoRepository: Repository<Grupo>,
  ) {}

  create(createAlumnoDto: CreateAlumnoDto) {
    const alumno = this.alumnoRepository.create(createAlumnoDto);
    return this.alumnoRepository.save(alumno);
  }

  findAll() {
    return this.alumnoRepository.find({ relations: ['grupo'] });
  }

  findOne(id: number) {
    return this.alumnoRepository.findOne({
      where: { id },
      relations: ['grupo'],
    });
  }

  update(id: number, updateAlumnoDto: UpdateAlumnoDto) {
    return this.alumnoRepository.update(id, updateAlumnoDto);
  }

  remove(id: number) {
    return this.alumnoRepository.delete(id);
  }
}
