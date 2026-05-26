// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreatePulseChannelDto } from './create-pulse-channel.dto';

const SafePartialType = PartialType as unknown as (
  classRef: new () => CreatePulseChannelDto,
) => new () => Partial<CreatePulseChannelDto>;

export class UpdatePulseChannelDto extends SafePartialType(
  CreatePulseChannelDto,
) {}
