import { ApiProperty } from '@nestjs/swagger';

export class UserMetricsResponseDto {
  @ApiProperty({ example: 150 }) total!: number;
  @ApiProperty({ example: 142 }) active!: number;
  @ApiProperty({ example: 8 }) inactive!: number;
  @ApiProperty({ example: 12 }) online!: number;
}
