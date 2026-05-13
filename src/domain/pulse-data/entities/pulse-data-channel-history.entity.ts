import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { PulseDataChannelHistoryChangeType } from '../../../core/type/pulse-data-channel-history-change';
import { PulseDataChannel } from './pulse-data-channel.entity';

@Index('PK_PULSE_DATA_CHANNEL_HISTORY', ['id'], { unique: true })
@Entity('pulseDataChannelHistory', { schema: 'dbo' })
export class PulseDataChannelHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('nvarchar', { name: 'symbol', length: 120 })
  dataMappingInfo!: string;

  @Column('datetime', {
    name: 'createdAt',
    unique: true,
    default: () => 'getdate()',
  })
  createdAt!: Date;

  @Column({
    type: 'nvarchar',
    name: 'pulseDataChannelHistoryChange',
    length: 30,
  })
  changeType!: PulseDataChannelHistoryChangeType;

  @Column({ type: 'int', name: 'meterId' })
  meterId!: number;

  @Column({ type: 'int', name: 'dataSourceId' })
  dataSourceId!: number;

  @ManyToOne(
    () => PulseDataChannel,
    (pulseDataChannel) => pulseDataChannel.pulseDataChannelHistory,
  )
  @JoinColumn([{ name: 'pulseDataChannelId', referencedColumnName: 'id' }])
  pulseDataChannel!: PulseDataChannel;
}
