import { ApiProperty } from '@nestjs/swagger';

export class MeterResponseDto {
  @ApiProperty({ example: 1 }) id!: number;
  @ApiProperty({ example: 'Licznik Energii Głównej' }) name!: string;
  @ApiProperty({ example: 'EQ-001' }) symbol!: string;
  @ApiProperty({ example: 'kWh' }) unit!: string;
  @ApiProperty({ example: { id: 2 }, required: false }) location?: {
    id: number;
  };
}
