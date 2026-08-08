import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateBeaconPosicionDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  posX!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  posY!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  mapaId?: number;
}
