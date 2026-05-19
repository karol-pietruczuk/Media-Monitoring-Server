import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { DataSourceProtocol } from '../../../core/enums/data-source-protocol.enum';
import { PulseDataChannel } from '../../pulse-data/entities/pulse-data-channel.entity';
import { TotalDataChannel } from '../../total-data/entities/total-data-channel.entity';

@Index('PK_DATA_SOURCE', ['id'], { unique: true })
@Entity('dataSource', { schema: 'dbo' })
export class DataSource {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('nvarchar', { name: 'protocol', length: 30 })
  protocol!: DataSourceProtocol;

  @Column('nvarchar', { name: 'connectionInfo', length: 120 })
  connectionInfo!: string;

  @Column('datetime2', {
    name: 'createdAt',
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
}
