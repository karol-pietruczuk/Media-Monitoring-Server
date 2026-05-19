import { PartialType } from '@nestjs/mapped-types';
import { CreateTotalChannelDto } from './create-total-channel.dto';

const SafePartialType = PartialType as unknown as (
  classRef: new () => CreateTotalChannelDto,
) => new () => Partial<CreateTotalChannelDto>;

export class UpdateTotalChannelDto extends SafePartialType(
  CreateTotalChannelDto,
) {}
