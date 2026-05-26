import { UserRole } from '../enums/user-role.enum';

export type AuthenticatedUser = {
  id: number;
  email: string;
  role: UserRole;
};
