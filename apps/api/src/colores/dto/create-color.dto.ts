import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateColorDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() || undefined : undefined,
  )
  nombre?: string;

  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  valorHex!: string;
}
