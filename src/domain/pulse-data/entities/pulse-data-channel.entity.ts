import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meter } from '../../meter/entities/meter.entity';
import { DataSource } from '../../data-source/entities/data-source.entity';
import { PulseDataChannelHistory } from './pulse-data-channel-history.entity';

@Index('PK_PULSE_DATA_CHANNEL', ['id'], { unique: true })
@Entity('pulseDataChannel', { schema: 'dbo' })
export class PulseDataChannel {
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

  @OneToOne(() => Meter, (meter) => meter.pulseDataChannel)
  @JoinColumn([{ name: 'meterId', referencedColumnName: 'id' }])
  meter!: Meter;

  @ManyToOne(() => DataSource, (dataSource) => dataSource.pulseDataChannel)
  @JoinColumn([{ name: 'dataSourceId', referencedColumnName: 'id' }])
  dataSource!: DataSource;

  @OneToMany(
    () => PulseDataChannelHistory,
    (pulseDataChannelHistory) => pulseDataChannelHistory.pulseDataChannel,
  )
  pulseDataChannelHistory!: PulseDataChannelHistory[];
}
