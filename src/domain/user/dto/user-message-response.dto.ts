import { ApiProperty } from '@nestjs/swagger';

export class UserMessageResponseDto {
  @ApiProperty({
    description: 'Komunikat potwierdzający wykonanie operacji',
    example: 'Operacja zakończona pomyślnie.',
  })
  message!: string;
}
