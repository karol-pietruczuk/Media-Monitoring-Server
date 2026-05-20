import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ResetUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 128, {
    message: 'Nowe hasło musi mieć co najmniej 8 znaków.',
  })
  newPassword!: string;
}
