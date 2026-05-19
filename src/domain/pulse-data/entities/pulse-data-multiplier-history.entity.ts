import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { PulseDataMultiplier } from './pulse-data-multiplier.entity';
import { User } from '../../user/entities/user.entity';
import type { PulseDataMultiplierChange } from '../../../core/enums/pulse-data-multiplier-change.enum';

@Index('PK_PULSE_DATA_MULTIPLIER_HISTORY', ['id'], { unique: true })
@Entity('pulseDataMultiplierHistory', { schema: 'dbo' })
export class PulseDataMultiplierHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({ type: 'int', name: 'pulseDataMultiplierId' })
  pulseDataMultiplierId!: number;

  @Column({ type: 'int', name: 'changedById', nullable: true })
  changedById!: number | null;

  @Column({
    type: 'nvarchar',
    name: 'pulseDataMultiplierHistoryChange',
    length: 50,
  })
  pulseDataMultiplierHistoryChange!: PulseDataMultiplierChange;

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

  @ManyToOne(() => PulseDataMultiplier, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'pulseDataMultiplierId' })
  pulseDataMultiplier!: PulseDataMultiplier;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'changedById' })
  changedBy!: User;
}
