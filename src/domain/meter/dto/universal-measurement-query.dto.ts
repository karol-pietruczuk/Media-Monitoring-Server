import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsDateString,
  IsString,
  IsBoolean,
  IsEnum,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export enum MeasurementGroupBy {
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  MONTH = 'month',
}

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
      'Typy danych oddzielone przecinkiem (pulse, total). Domyślnie pobiera oba.',
    example: 'pulse,total',
  })
  @IsOptional()
  @IsString()
  types?: string;

  @ApiPropertyOptional({
    enum: MeasurementGroupBy,
    description: 'Interwał agregacji danych pod wykres (domyślnie hour).',
    example: MeasurementGroupBy.HOUR,
    default: MeasurementGroupBy.HOUR,
  })
  @IsOptional()
  @IsEnum(MeasurementGroupBy)
  groupBy?: MeasurementGroupBy = MeasurementGroupBy.HOUR;

  @ApiPropertyOptional({
    description:
      'Czy dołączyć surową tablicę measurements z zakresu (domyślnie false).',
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeMeasurements?: boolean = false;

  @ApiPropertyOptional({
    description:
      'Maksymalna liczba kubełków na wykresie / surowych pomiarów (ochrona pamięci).',
    example: 2000,
    default: 2000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10000)
  limit?: number = 2000;
}
