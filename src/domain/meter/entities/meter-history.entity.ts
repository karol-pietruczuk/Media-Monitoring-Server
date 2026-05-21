import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Meter } from './meter.entity';
import { User } from '../../user/entities/user.entity';
import type { MeterChange } from '../../../core/enums/meter-change.enum';

@Index('PK_METER_HISTORY', ['id'], { unique: true })
@Entity('meterHistory', { schema: 'dbo' })
export class MeterHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({ type: 'int', name: 'meterId' })
  meterId!: number;

  @Column({ type: 'int', name: 'changedById', nullable: true })
  changedById!: number | null;

  @Column({ type: 'nvarchar', name: 'meterChange', length: 50 })
  meterChange!: MeterChange;

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    name: 'oldValues',
    nullable: true,
  })
  oldValues!: string | null; // <-- TUTAJ dodaj | null

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    name: 'newValues',
    nullable: true,
  })
  newValues!: string | null; // <-- TUTAJ dodaj | null

  @CreateDateColumn({ type: 'datetime2', name: 'createdAt' })
  createdAt!: Date;

  @ManyToOne(() => Meter, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'meterId' })
  meter!: Meter;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'changedById' })
  changedBy!: User;
}
