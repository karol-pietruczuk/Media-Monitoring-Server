import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Length,
  IsInt,
} from 'class-validator';

export class CreateLocationDto {
  @ApiPropertyOptional({ description: 'Opcjonalne ID lokalizacji.' })
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50, {
    message:
      'Nazwa lokalizacji głównej musi mieć minimum 2 znaki i maksymalnie 50 znaków.',
  })
  mainLocation!: string;

  @IsString()
  @IsOptional()
  @Length(2, 50, {
    message:
      'Nazwa lokalizacji podrzędnej musi mieć minimum 2 znaki i maksymalnie 50 znaków.',
  })
  subLocation!: string | null;
}
