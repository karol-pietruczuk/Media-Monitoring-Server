import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @MinLength(3, { message: 'Nazwa użytkownika jest za krótka' })
  mainLocation!: string;

  @IsOptional()
  @IsString()
  subLocation?: string | null;
}
