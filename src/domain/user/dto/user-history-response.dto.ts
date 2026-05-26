import { ApiProperty } from '@nestjs/swagger';

export class UserHistoryResponseDto {
  @ApiProperty({ example: 1 }) id!: number;
  @ApiProperty({ example: 5 }) userId!: number;
  @ApiProperty({ example: 1 }) changedById!: number;
  @ApiProperty({ example: 'UpdatedUser' }) action!: string;
  @ApiProperty({ example: { role: 'Viewer' } }) oldValues!: Record<
    string,
    unknown
  >;
  @ApiProperty({ example: { role: 'Operator' } }) newValues!: Record<
    string,
    unknown
  >;
  @ApiProperty({ example: '2026-03-26T09:41:00.000Z' }) createdAt!: Date;
}
