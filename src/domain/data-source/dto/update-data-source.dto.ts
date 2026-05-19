import { PartialType } from '@nestjs/mapped-types';
import { CreateDataSourceDto } from './create-data-source.dto';

const SafePartialType = PartialType as unknown as (
  classRef: new () => CreateDataSourceDto,
) => new () => Partial<CreateDataSourceDto>;

export class UpdateDataSourceDto extends SafePartialType(CreateDataSourceDto) {}
