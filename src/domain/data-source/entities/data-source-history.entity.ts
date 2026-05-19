import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { DataSource } from './data-source.entity';
import { User } from '../../user/entities/user.entity';
import type { DataSourceChange } from '../../../core/enums/data-source-change.enum';

@Index('PK_DATA_SOURCE_HISTORY', ['id'], { unique: true })
@Entity('dataSourceHistory', { schema: 'dbo' })
export class DataSourceHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({ type: 'int', name: 'dataSourceId' })
  dataSourceId!: number;

  @Column({ type: 'int', name: 'changedById', nullable: true })
  changedById!: number | null; // Kluczowe dla audytu (kto edytował IP/port)

  @Column({ type: 'nvarchar', length: 50, name: 'dataSourceChange' })
  dataSourceChange!: DataSourceChange;

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    name: 'oldValues',
    nullable: true,
  })
  oldValues!: string | null;

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    name: 'newValues',
    nullable: true,
  })
  newValues!: string | null;

  @CreateDateColumn({ type: 'datetime2', name: 'createdAt' })
  createdAt!: Date;

  @ManyToOne(() => DataSource, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'dataSourceId' })
  dataSource!: DataSource;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'changedById' })
  changedBy!: User;
}
