import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectPuertoDto {
  @IsString()
  @IsNotEmpty()
  path!: string;
}
