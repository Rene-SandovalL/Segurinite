import { IsNotEmpty, IsString } from 'class-validator';

export class SetWifiDto {
  @IsString()
  @IsNotEmpty()
  ssid!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
