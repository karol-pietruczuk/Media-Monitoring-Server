import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({
    description: 'Komunikat zwrotny z operacji',
    example: 'Wylogowano pomyślnie i unieważniono tokeny sesji.',
  })
  message!: string;
}
