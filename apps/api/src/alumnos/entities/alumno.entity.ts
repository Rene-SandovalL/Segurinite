import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Grupo } from '../../grupos/entities/grupo.entity';

@Entity()
export class Alumno {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 60 })
  nombre!: string;

  @Column({ type: 'varchar', length: 60 })
  apellido!: string;

  @Column({ type: 'date' })
  fechaNacimiento!: Date;

  @Column({ type: 'varchar', length: 30, nullable: true })
  idPulsera!: string; // ID del beacon BLE vinculado al alumno

  @Column({
    type: 'enum',
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    nullable: true,
  })
  tipoSangre!: string;

  /*
  @Column({ type: 'varchar', length: 100, nullable: true })
  nombrePadre!: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  telefonoPadre!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fotografia!: string;
*/
  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @ManyToOne(() => Grupo, (grupo) => grupo.alumnos)
  grupo!: Grupo;
}
