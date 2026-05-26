import { ApiProperty } from '@nestjs/swagger';

export class PulseChannelResponseDto {
  @ApiProperty({ example: 1 }) id!: number;
  @ApiProperty({ example: { id: 5 } }) meter!: { id: number };
  @ApiProperty({ example: { id: 2 } }) dataSource!: { id: number };
  @ApiProperty({ example: '{"pulseWeight": 10, "unit": "kWh"}' })
  dataMappingInfo!: string;
}
