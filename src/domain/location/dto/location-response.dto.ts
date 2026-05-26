import { ApiProperty } from '@nestjs/swagger';

export class LocationResponseDto {
  @ApiProperty({ example: 1 }) id!: number;
  @ApiProperty({ example: 'Hala Produkcyjna A' }) mainLocation!: string;
  @ApiProperty({ example: 'Sektor 3 / Maszyna 12', nullable: true })
  subLocation!: string | null;
}
