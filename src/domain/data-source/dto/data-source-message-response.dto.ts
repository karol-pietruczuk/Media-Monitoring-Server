import { ApiProperty } from '@nestjs/swagger';

export class DataSourceMessageResponseDto {
  @ApiProperty({ example: 'Źródło danych zostało pomyślnie usunięte.' })
  message!: string;
}
