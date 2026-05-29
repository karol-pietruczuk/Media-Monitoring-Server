import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsDateString } from 'class-validator';

export class UpdateMultiplierDto {
  @ApiPropertyOptional({ example: 2.0 })
  @IsOptional()
  @IsNumber()
  value?: number;

  @ApiPropertyOptional({ example: '2026-06-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  expirationDateFrom?: string;
}
