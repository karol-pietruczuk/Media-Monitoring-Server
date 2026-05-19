import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import type { PulseDataChannelChange } from '../../../core/enums/pulse-data-channel-change.enum';

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
  pulseDataChannelChange!: PulseDataChannelChange;

  @Column({ type: 'int', name: 'pulseDataChannelId' })
  pulseDataChannelId!: number;

  @Column('nvarchar', { name: 'pulseDataChannelDataMappingInfo', length: 120 })
  pulseDataChannelDataMappingInfo!: string;

  @Column({ type: 'int', name: 'pulseDataChannelMeterId' })
  pulseDataChannelMeterId!: number;

  @Column({ type: 'int', name: 'pulseDataChannelDataSourceId' })
  pulseDataChannelDataSourceId!: number;

  @Column('datetime2', {
    name: 'pulseDataChannelCreatedAt',
  })
  pulseDataChannelCreatedAt!: Date;

  @Column('datetime2', {
    name: 'createdAt',
    default: () => 'getdate()',
  })
  createdAt!: Date;
}
