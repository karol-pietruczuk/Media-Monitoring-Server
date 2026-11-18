import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsDateString, IsString, IsBoolean } from 'class-validator';

export class UniversalMeasurementQueryDto {
  @ApiPropertyOptional({
    description: 'Data początkowa (ISO 8601)',
    example: '2026-06-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({
    description: 'Data końcowa (ISO 8601)',
    example: '2026-06-06T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({
    description:
      'Typy danych do pobrania oddzielone przecinkiem (pulse, total). Jeśli puste, pobiera oba.',
    example: 'pulse,total',
  })
  @IsOptional()
  @IsString()
  types?: string;

  @ApiPropertyOptional({
    description:
      'Czy dołączyć surową tablicę wszystkich pomiarów z zadanego zakresu (domyślnie false).',
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeMeasurements?: boolean = false;
}
