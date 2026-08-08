import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { pulseras_estado } from '../../generated/prisma/client';

export class UpdatePulseraConfigDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  alias?: string;

  @IsOptional()
  @IsEnum(pulseras_estado)
  estado?: pulseras_estado;
}
