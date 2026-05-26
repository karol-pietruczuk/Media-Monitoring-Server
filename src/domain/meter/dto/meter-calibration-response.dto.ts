import { ApiProperty } from '@nestjs/swagger';

export class CalibrationResponseDto {
  @ApiProperty({ example: 1 }) id!: number;
  @ApiProperty({ example: 12450.75 }) value!: number;
  @ApiProperty({ example: '2026-05-26T12:00:00.000Z' }) timestamp!: Date;
  @ApiProperty({ example: { id: 1 } }) meter!: { id: number };
}
