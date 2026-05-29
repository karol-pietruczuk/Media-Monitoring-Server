import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreatePulseChannelDto {
  @ApiPropertyOptional({
    description: 'Opcjonalne ID kanału danych impulsowych.',
  })
  @IsOptional()
  @IsInt()
  id?: number;

  @IsInt()
  @IsNotEmpty()
  meterId!: number;

  @IsInt()
  @IsNotEmpty()
  dataSourceId!: number;

  @IsObject()
  @IsNotEmpty()
  dataMappingInfo!: Record<string, unknown>; // Struktura mapowania węzłów w postaci obiektu JSON
}
