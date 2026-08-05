import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class PulseraTelemetriaDto {
  @IsString()
  @IsNotEmpty()
  mac!: string;

  @IsInt()
  @Min(-1)
  area!: number;

  @IsInt()
  @Min(0)
  bpm!: number;

  @IsNumber()
  @Min(0)
  spo2!: number;

  @IsNumber()
  temp!: number;
}
