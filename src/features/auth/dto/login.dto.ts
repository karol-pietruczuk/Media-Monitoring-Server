import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Podaj poprawny adres e-mail.' })
  @IsNotEmpty({ message: 'E-mail nie może być pusty.' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Hasło nie może być puste.' })
  password!: string;
}
