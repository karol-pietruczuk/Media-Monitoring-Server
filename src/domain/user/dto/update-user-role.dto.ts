import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../../core/enums/user-role.enum';

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;
}
