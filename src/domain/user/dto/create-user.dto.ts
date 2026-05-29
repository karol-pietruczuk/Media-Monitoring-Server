import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UserRole } from '../../../core/enums/user-role.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiPropertyOptional({
    description:
      'Opcjonalne ID użytkownika. Jeśli nie podane, zostanie wygenerowane automatycznie.',
  })
  @IsOptional()
  @IsInt()
  id?: number;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 128, {
    message: 'Hasło musi mieć co najmniej 8 znaków.',
  })
  password!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  lastName!: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;
}
