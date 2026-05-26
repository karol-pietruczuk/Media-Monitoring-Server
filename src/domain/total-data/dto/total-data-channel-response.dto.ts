import { ApiProperty } from '@nestjs/swagger';

export class TotalDataChannelResponseDto {
  @ApiProperty({ example: 1 }) id!: number;
  @ApiProperty({ example: { id: 3 } }) meter!: { id: number };
  @ApiProperty({ example: { id: 2 } }) dataSource!: { id: number };
  @ApiProperty({ example: '{"register": 40001, "multiplier": 0.1}' })
  dataMappingInfo!: string;
}
