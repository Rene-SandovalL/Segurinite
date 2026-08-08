import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class RegistrarPulseraDto {
  @IsString()
  @Matches(/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/, {
    message: 'macAddress debe tener formato AA:BB:CC:DD:EE:FF',
  })
  macAddress!: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  alias?: string;
}
