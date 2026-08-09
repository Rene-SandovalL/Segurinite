import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class FindAsistenciasQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  grupoId!: number;

  @IsOptional()
  @IsDateString()
  fecha?: string;
}
