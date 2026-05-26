import { ApiProperty } from '@nestjs/swagger';

export class MeterMessageResponseDto {
  @ApiProperty({ example: 'Licznik został pomyślnie usunięty.' })
  message!: string;
}
