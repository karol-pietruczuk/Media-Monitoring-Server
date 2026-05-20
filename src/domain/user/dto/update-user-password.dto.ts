import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 128, {
    message: 'Aktualne hasło musi mieć co najmniej 8 znaków.',
  })
  oldPassword!: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 128, {
    message: 'Nowe hasło musi mieć co najmniej 8 znaków.',
  })
  newPassword!: string;
}
