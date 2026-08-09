import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

/** Filtros comunes a todos los endpoints de estadísticas. */
export class EstadisticasQueryDto {
  /** Si se omite, se agregan todos los grupos. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  grupoId?: number;

  /** Si se omiten fechaInicio/fechaFin, se usan los últimos 7 días. */
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;
}

/** Tiempo en escuela se consulta de un solo día, no de un rango. */
export class TiempoEnEscuelaQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  grupoId?: number;

  /** Si se omite, se usa el día de hoy en hora local de la escuela. */
  @IsOptional()
  @IsDateString()
  fecha?: string;
}
