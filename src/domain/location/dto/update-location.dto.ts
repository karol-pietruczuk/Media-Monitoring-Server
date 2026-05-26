// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateLocationDto } from './create-location.dto';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
