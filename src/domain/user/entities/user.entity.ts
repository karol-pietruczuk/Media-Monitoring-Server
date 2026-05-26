import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { UserRole } from '../../../core/enums/user-role.enum';

@Index('PK_User', ['id'], { unique: true })
@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'nvarchar', length: 150 })
  @Index('UQ_users_email', { unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, select: false })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  hashedRefreshToken!: string | null;

  @Column({ type: 'bit', default: 0 })
  isLoggedIn!: boolean;

  @Column({ type: 'nvarchar', length: 100 })
  firstName!: string;

  @Column({ type: 'nvarchar', length: 100 })
  lastName!: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: UserRole.Viewer,
  })
  role!: UserRole;

  @Column({ type: 'bit', default: 1 })
  isActive!: boolean;

  @CreateDateColumn({ type: 'datetime2' })
  createdAt!: Date;
}
