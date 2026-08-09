import { Type } from 'class-transformer';
import { IsInt, Matches, Max, Min } from 'class-validator';

const HORA_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class UpdateConfiguracionHorarioDto {
  @Matches(HORA_REGEX, { message: 'horaEntrada debe tener formato HH:mm' })
  horaEntrada!: string;

  @Matches(HORA_REGEX, { message: 'horaSalida debe tener formato HH:mm' })
  horaSalida!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(180)
  toleranciaTardanzaMinutos!: number;
}
