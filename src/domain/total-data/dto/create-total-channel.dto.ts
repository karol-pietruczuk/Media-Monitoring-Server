import { IsInt, IsNotEmpty, IsObject } from 'class-validator';

export class CreateTotalChannelDto {
  @IsInt()
  @IsNotEmpty()
  meterId!: number;

  @IsInt()
  @IsNotEmpty()
  dataSourceId!: number;

  @IsObject()
  @IsNotEmpty()
  dataMappingInfo!: Record<string, unknown>;
}
