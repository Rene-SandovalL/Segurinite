import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateBeaconConfigDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  nombre?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  colorId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  zonaId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  mapaId?: number;
}
