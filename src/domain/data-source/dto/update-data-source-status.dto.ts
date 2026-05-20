import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateDataSourceStatusDto {
  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;
}
