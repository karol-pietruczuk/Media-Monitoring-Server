import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Unit } from '../../../core/enums/unit.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMeterDto {
  @ApiPropertyOptional({ description: 'Opcjonalne ID licznika.' })
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  symbol!: string;

  @IsEnum(Unit)
  @IsNotEmpty()
  unit!: Unit;

  @IsInt()
  @IsNotEmpty()
  locationId!: number; // Przypisanie licznika do konkretnej Hali/Lokalizacji
}
