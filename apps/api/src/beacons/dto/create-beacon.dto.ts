import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBeaconDto {
  @Type(() => Number)
  @IsInt()
  beaconId!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  zonaId!: number;

  @IsOptional()
  @IsString()
  @Matches(/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/, {
    message: 'macAddress debe tener formato AA:BB:CC:DD:EE:FF',
  })
  macAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  nombre?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  colorId?: number;
}
