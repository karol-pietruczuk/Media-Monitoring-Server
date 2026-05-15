import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

@Index('PK_User_History', ['id'], { unique: true })
@Entity('user_history')
export class UserHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({ type: 'int' })
  userId!: number; // ID użytkownika, którego dane zmieniono

  @Column({ type: 'int', nullable: true })
  changedById!: number | null; // ID zalogowanego użytkownika (np. admina), który kliknął "zapisz"

  @Column({ type: 'nvarchar', length: 50 })
  action!: string; // np. 'USER_CREATED', 'ROLE_CHANGED', 'USER_DEACTIVATED'

  // W MSSQL nvarchar(max) typu ISJSON pozwoli zapisać stan pól przed i po zmianie
  @Column({
    type: 'nvarchar',
    length: 'MAX',
    nullable: true,
  })
  oldValues!: string; // JSON string: {"role": "VIEWER"}

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    nullable: true,
  })
  newValues!: string; // JSON string: {"role": "ADMIN"}

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  comment!: string; // Opcjonalny powód zmiany wpisany przez admina

  @CreateDateColumn({ type: 'datetime2' })
  createdAt!: Date; // Dokładna data i czas operacji

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'changedById' })
  changedBy!: User;
}
