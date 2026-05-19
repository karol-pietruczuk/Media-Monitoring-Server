import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { PulseDataChannel } from './pulse-data-channel.entity';
import { User } from '../../user/entities/user.entity';
import type { PulseDataChannelChange } from '../../../core/enums/pulse-data-channel-change.enum';

@Index('PK_PULSE_DATA_CHANNEL_HISTORY', ['id'], { unique: true })
@Entity('pulseDataChannelHistory', { schema: 'dbo' })
export class PulseDataChannelHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({ type: 'int', name: 'pulseDataChannelId' })
  pulseDataChannelId!: number;

  @Column({ type: 'int', name: 'changedById', nullable: true })
  changedById!: number | null; // Identyfikacja administratora

  @Column({ type: 'nvarchar', name: 'pulseDataChannelChange', length: 50 })
  pulseDataChannelChange!: PulseDataChannelChange;

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

  @ManyToOne(() => PulseDataChannel, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'pulseDataChannelId' })
  pulseDataChannel!: PulseDataChannel;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'changedById' })
  changedBy!: User;
}
