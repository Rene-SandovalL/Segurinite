import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Alumno } from '../../alumnos/entities/alumno.entity';

@Entity()
export class Grupo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 60 })
  nombre!: string; // Ej: "1° A", "Kínder 2"

  @Column({ type: 'varchar', length: 30 })
  grado!: string; // Ej: "Primero", "Kínder"

  @OneToMany(() => Alumno, (alumno) => alumno.grupo, { cascade: true })
  alumnos!: Alumno[];
}
