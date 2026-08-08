import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMapaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  nombre!: string;
}
