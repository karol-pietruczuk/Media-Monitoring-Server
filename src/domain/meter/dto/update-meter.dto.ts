import { PartialType } from '@nestjs/mapped-types';
import { CreateMeterDto } from './create-meter.dto';

const SafePartialType = PartialType as unknown as (
  classRef: new () => CreateMeterDto,
) => new () => Partial<CreateMeterDto>;

export class UpdateMeterDto extends SafePartialType(CreateMeterDto) {}
