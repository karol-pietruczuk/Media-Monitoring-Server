import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreateTotalChannelDto {
  @ApiPropertyOptional({
    description: 'Opcjonalne ID kanału danych sumarycznych.',
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
  dataMappingInfo!: Record<string, unknown>;
}
