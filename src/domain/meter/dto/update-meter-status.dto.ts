import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateMeterStatusDto {
  @ApiProperty({
    description: 'Włącza lub wyłącza zbieranie i przeliczanie danych',
  })
  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;
}
