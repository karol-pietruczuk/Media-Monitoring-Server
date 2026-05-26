import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../core/enums/user-role.enum';

export class UserResponseDto {
  @ApiProperty({
    description: 'Unikalny identyfikator użytkownika w bazie MSSQL',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Adres e-mail użytkownika',
    example: 'admin@company.com',
  })
  email!: string;

  @ApiProperty({ description: 'Imię', example: 'Jan' })
  firstName!: string;

  @ApiProperty({ description: 'Nazwisko', example: 'Kowalski' })
  lastName!: string;

  @ApiProperty({
    description: 'Rola systemowa nadająca uprawnienia',
    enum: UserRole,
    example: UserRole.Operator,
  })
  role!: UserRole;

  @ApiProperty({
    description: 'Flaga określająca, czy konto jest aktywne',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Data i czas utworzenia konta',
    example: '2026-03-15T08:30:00.000Z',
  })
  createdAt!: Date;
}
