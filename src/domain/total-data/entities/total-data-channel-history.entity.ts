import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { TotalDataChannel } from './total-data-channel.entity';
import { User } from '../../user/entities/user.entity';
import type { TotalDataChannelChange } from '../../../core/enums/total-data-channel-change.enum';

@Index('PK_TOTAL_DATA_CHANNEL_HISTORY', ['id'], { unique: true })
@Entity('totalDataChannelHistory', { schema: 'dbo' })
export class TotalDataChannelHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({ type: 'int', name: 'totalDataChannelId' })
  totalDataChannelId!: number;

  @Column({ type: 'int', name: 'changedById', nullable: true })
  changedById!: number | null; // Śledzenie zalogowanego administratora/operatora

  @Column({ type: 'nvarchar', name: 'totalDataChannelChangeType', length: 50 })
  totalDataChannelChangeType!: TotalDataChannelChange;

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

  @ManyToOne(() => TotalDataChannel, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'totalDataChannelId' })
  totalDataChannel!: TotalDataChannel;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'changedById' })
  changedBy!: User;
}
