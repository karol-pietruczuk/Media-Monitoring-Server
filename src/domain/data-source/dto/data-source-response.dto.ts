import { ApiProperty } from '@nestjs/swagger';

export class DataSourceResponseDto {
  @ApiProperty({ example: 1 }) id!: number;
  @ApiProperty({ example: 'ModbusTCP' }) protocol!: string;
  @ApiProperty({ example: '{"ip": "192.168.1.50", "port": 502}' })
  connectionInfo!: string;
  @ApiProperty({ example: true }) isActive!: boolean;
}
