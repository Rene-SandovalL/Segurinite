import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : '',
  )
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @Transform(({ value }) => {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }

    return false;
  })
  @IsBoolean()
  rememberMe!: boolean;
}
