import { ApiProperty } from '@nestjs/swagger';

export class PulseChannelMessageResponseDto {
  @ApiProperty({ example: 'Kanał impulsowy został pomyślnie usunięty.' })
  message!: string;
}
