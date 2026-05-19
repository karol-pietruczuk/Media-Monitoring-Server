import { IsInt, IsNotEmpty, IsObject } from 'class-validator';

export class CreatePulseChannelDto {
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
