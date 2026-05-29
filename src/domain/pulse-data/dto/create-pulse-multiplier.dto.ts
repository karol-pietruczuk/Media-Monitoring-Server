import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreateMultiplierDto {
  @ApiPropertyOptional({
    description:
      'Opcjonalne ID mnożnika (używane głównie podczas przywracania backupu).',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({
    description:
      'Wartość mnożnika przeliczeniowego (np. 0.1, 1, 10 dla jednego impulsu).',
    example: 1.5,
  })
  @IsNotEmpty()
  @IsNumber()
  value!: number;

  @ApiProperty({
    description: 'Data i godzina, od której obowiązuje dany mnożnik.',
    example: '2026-05-29T12:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  expirationDateFrom!: string;

  @ApiProperty({
    description: 'ID licznika, do którego przypisany jest mnożnik.',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  meterId!: number;
}
