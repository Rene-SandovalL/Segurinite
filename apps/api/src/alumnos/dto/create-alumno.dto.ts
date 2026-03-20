import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';

const TIPOS_SANGRE_VALIDOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export class TutorCreateAlumnoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/)
  telefono!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  parentesco?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  direccion?: string;
}

export class ContactoEmergenciaCreateAlumnoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/)
  telefono!: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  parentesco?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  direccion?: string;
}

export class CreateAlumnoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  apellido!: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsIn(TIPOS_SANGRE_VALIDOS)
  tipoSangre?: string;

  @IsNumberString()
  pulseraId!: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => TutorCreateAlumnoDto)
  tutores?: TutorCreateAlumnoDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => ContactoEmergenciaCreateAlumnoDto)
  contactosEmergencia?: ContactoEmergenciaCreateAlumnoDto[];
}
