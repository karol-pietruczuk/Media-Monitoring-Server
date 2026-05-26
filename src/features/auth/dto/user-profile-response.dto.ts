import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../core/enums/user-role.enum';

export class UserProfileResponseDto {
  @ApiProperty({
    description: 'Unikalny identyfikator użytkownika',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Adres e-mail',
    example: 'jan.kowalski@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Rola użytkownika w systemie',
    enum: UserRole,
    example: UserRole.Operator,
  })
  role!: UserRole;
}
