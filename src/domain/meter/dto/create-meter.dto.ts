import { IsEnum, IsInt, IsNotEmpty, IsString, Length } from 'class-validator';
import { Unit } from '../../../core/enums/unit.enum';

export class CreateMeterDto {
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
