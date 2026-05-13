import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import type { PulseDataChannelChangeType } from '../../../core/type/pulse-data-channel-change-type';

@Index('PK_PULSE_DATA_CHANNEL_HISTORY', ['id'], { unique: true })
@Entity('pulseDataChannelHistory', { schema: 'dbo' })
export class PulseDataChannelHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({
    type: 'nvarchar',
    name: 'pulseDataChannelChange',
    length: 30,
  })
  pulseDataChannelChange!: PulseDataChannelChangeType;

  @Column({ type: 'int', name: 'pulseDataChannelId' })
  pulseDataChannelId!: number;

  @Column('nvarchar', { name: 'pulseDataChannelDataMappingInfo', length: 120 })
  pulseDataChannelDataMappingInfo!: string;

  @Column({ type: 'int', name: 'pulseDataChannelMeterId' })
  pulseDataChannelMeterId!: number;

  @Column({ type: 'int', name: 'pulseDataChannelDataSourceId' })
  pulseDataChannelDataSourceId!: number;

  @Column('datetime', {
    name: 'pulseDataChannelCreatedAt',
  })
  pulseDataChannelCreatedAt!: Date;

  @Column('datetime', {
    name: 'createdAt',
    default: () => 'getdate()',
  })
  createdAt!: Date;
}
