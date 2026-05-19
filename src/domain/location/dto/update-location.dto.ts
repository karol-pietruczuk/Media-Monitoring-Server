import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationDto } from './create-location.dto';

// Rzutujemy funkcję PartialType przez as unknown, aby uciszyć regułę lintera no-unsafe-call
const SafePartialType = PartialType as unknown as (
  classRef: new () => CreateLocationDto,
) => new () => Partial<CreateLocationDto>;

export class UpdateLocationDto extends SafePartialType(CreateLocationDto) {}
