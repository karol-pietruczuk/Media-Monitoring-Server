import { IsDateString, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCalibrationDto {
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
