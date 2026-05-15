import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { UserRole } from '../../../core/enum/user-role.enum';

@Index('PK_User', ['id'], { unique: true })
@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'nvarchar', length: 150 })
  @Index('UQ_users_email', { unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, select: false }) // Ukryte domyślnie dla całego systemu
  passwordHash!: string;

  @Column({ type: 'nvarchar', length: 100 })
  firstName!: string;

  @Column({ type: 'nvarchar', length: 100 })
  lastName!: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: UserRole.VIEWER,
  })
  role!: UserRole;

  @Column({ type: 'bit', default: 1 }) // W MSSQL 'bit' reprezentuje wartość boolean
  isActive!: boolean;

  @CreateDateColumn({ type: 'datetime2' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updatedAt!: Date;
}
