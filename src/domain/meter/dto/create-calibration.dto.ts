import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateCalibrationDto {
  @ApiPropertyOptional({ description: 'Opcjonalne ID rekordu kalibracji.' })
  @IsOptional()
  @IsInt()
  id?: number;

  @IsInt()
  @IsNotEmpty()
  meterId!: number;

  @IsNumber({ maxDecimalPlaces: 4 })
  @IsNotEmpty()
  value!: number; // Rzeczywisty, fizyczny stan licznika spisany przez automatyka

  @IsDateString()
  @IsNotEmpty()
  timestamp!: Date; // Moment odczytu fizycznego
}
