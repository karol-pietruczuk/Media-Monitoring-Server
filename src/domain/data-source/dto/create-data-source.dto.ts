import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
} from 'class-validator';
import { DataSourceProtocol } from '../../../core/enums/data-source-protocol.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDataSourceDto {
  @ApiPropertyOptional({ description: 'Opcjonalne ID źródła danych.' })
  @IsOptional()
  @IsInt()
  id?: number;

  @IsEnum(DataSourceProtocol)
  @IsNotEmpty()
  protocol!: DataSourceProtocol;

  @IsObject()
  @IsNotEmpty()
  connectionInfo!: Record<string, unknown>;
}
