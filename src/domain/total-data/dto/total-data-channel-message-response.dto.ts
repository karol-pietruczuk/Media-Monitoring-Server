import { ApiProperty } from '@nestjs/swagger';

export class TotalDataChannelMessageResponseDto {
  @ApiProperty({ example: 'Kanał danych został pomyślnie usunięty.' })
  message!: string;
}
