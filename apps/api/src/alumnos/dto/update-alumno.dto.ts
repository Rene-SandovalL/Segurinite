import {
	ArrayMaxSize,
	IsArray,
	IsDateString,
	IsIn,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	Min,
	ValidateIf,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

const TIPOS_SANGRE_VALIDOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export class TutorUpdateAlumnoDto {
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

export class ContactoEmergenciaUpdateAlumnoDto {
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

export class UpdateAlumnoDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MaxLength(60)
	nombre?: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MaxLength(60)
	apellido?: string;

	@IsOptional()
	@IsDateString()
	fechaNacimiento?: string;

	@IsOptional()
	@IsIn(TIPOS_SANGRE_VALIDOS)
	tipoSangre?: string;

	@IsOptional()
	@IsArray()
	@ArrayMaxSize(2)
	@ValidateNested({ each: true })
	@Type(() => TutorUpdateAlumnoDto)
	tutores?: TutorUpdateAlumnoDto[];

	@IsOptional()
	@IsArray()
	@ArrayMaxSize(3)
	@ValidateNested({ each: true })
	@Type(() => ContactoEmergenciaUpdateAlumnoDto)
	contactosEmergencia?: ContactoEmergenciaUpdateAlumnoDto[];
}

export class UpdateAlumnoGrupoDto {
	@IsOptional()
	@ValidateIf((_, value) => value !== null)
	@Type(() => Number)
	@IsInt()
	@Min(1)
	grupoId?: number | null;
}
