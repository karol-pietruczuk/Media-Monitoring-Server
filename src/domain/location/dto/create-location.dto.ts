import { IsNotEmpty, IsString, IsOptional, Length } from 'class-validator';

export class CreateLocationDto {
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
