import { ApiProperty } from '@nestjs/swagger';

export class LocationMessageResponseDto {
  @ApiProperty({ example: 'Lokalizacja została pomyślnie usunięty.' })
  message!: string;
}
