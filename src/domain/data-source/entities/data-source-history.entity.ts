import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { DataSourceProtocol } from '../../../core/type/data-source-protocol';
import { PulseDataChannel } from '../../pulse-data/entities/pulse-data-channel.entity';
import { TotalDataChannel } from '../../total-data/entities/total-data-channel.entity';
import { DataSource } from './data-source.entity';
import type { DataSourceHistoryChangetype } from '../../../core/type/data-source-history-change';

@Index('PK_DATA_SOURCE_HISTORY', ['id'], { unique: true })
@Entity('dataSourceHistory', { schema: 'dbo' })
export class DataSourceHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('nvarchar', { name: 'symbol', length: 30 })
  protocol!: DataSourceProtocol;

  @Column('nvarchar', { name: 'connectionInfo', length: 120 })
  connectionInfo!: string;

  @Column({
    type: 'nvarchar',
    name: 'datasourceChange',
    length: 30,
  })
  datasourceChange!: DataSourceHistoryChangetype;

  @Column('datetime', {
    name: 'createdAt',
    unique: true,
    default: () => 'getdate()',
  })
  createdAt!: Date;

  @OneToMany(
    () => PulseDataChannel,
    (pulseDataChannel) => pulseDataChannel.dataSource,
  )
  pulseDataChannel!: PulseDataChannel[];

  @OneToMany(
    () => TotalDataChannel,
    (totalDataChannel) => totalDataChannel.dataSource,
  )
  totalDataChannel!: TotalDataChannel[];

  @ManyToOne(() => DataSource, (dataSource) => dataSource.dataSourceHistory)
  @JoinColumn([{ name: 'dataSourceId', referencedColumnName: 'id' }])
  dataSource!: DataSource;
}
