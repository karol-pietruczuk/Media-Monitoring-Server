import { IsEnum, IsNotEmpty, IsObject } from 'class-validator';
import { DataSourceProtocol } from '../../../core/enums/data-source-protocol.enum';

export class CreateDataSourceDto {
  @IsEnum(DataSourceProtocol)
  @IsNotEmpty()
  protocol!: DataSourceProtocol;

  @IsObject()
  @IsNotEmpty()
  connectionInfo!: Record<string, unknown>; // Bezpieczny, dynamiczny obiekt konfiguracyjny
}
