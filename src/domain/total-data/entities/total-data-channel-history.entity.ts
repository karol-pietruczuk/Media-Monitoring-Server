import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import type { TotalDataChannelChangeType } from '../../../core/type/total-data-channel-change.type';

@Index('PK_TOTAL_DATA_CHANNEL_HISTORY', ['id'], { unique: true })
@Entity('totalDataChannelHistory', { schema: 'dbo' })
export class TotalDataChannelHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({
    type: 'nvarchar',
    name: 'totalDataChannelChangeType',
    length: 30,
  })
  totalDataChannelChangeType!: TotalDataChannelChangeType;

  @Column({ type: 'int', name: 'totalDataChannelId' })
  totalDataChannelId!: number;

  @Column('nvarchar', { name: 'totalDataChannelDataMappingInfo', length: 120 })
  totalDataChannelDataMappingInfo!: string;

  @Column({ type: 'int', name: 'totalDataChannelMeterId' })
  totalDataChannelMeterId!: number;

  @Column({ type: 'int', name: 'totalDataChannelDataSourceId' })
  totalDataChannelDataSourceId!: number;

  @Column('datetime2', {
    name: 'totalDataChannelCreatedAt',
  })
  totalDataChannelCreatedAt!: Date;

  @Column('datetime2', {
    name: 'createdAt',
    default: () => 'getdate()',
  })
  createdAt!: Date;
}
