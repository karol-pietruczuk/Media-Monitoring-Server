import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @Length(2, 100)
  firstName?: string;

  @IsString()
  @IsOptional()
  @Length(2, 100)
  lastName?: string;
}
