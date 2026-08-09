import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';

export class UpdateConfiguracionAlertasDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  tempAlertaMin!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  tempNormalMin!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  tempNormalMax!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  tempAlertaMax!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  bpmAlto!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  contadorTemp!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  contadorVitalCero!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  contadorFueraZona!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  sinSenalSegundos!: number;
}
