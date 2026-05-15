import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meter } from '../../meter/entities/meter.entity';
import { DataSource } from '../../data-source/entities/data-source.entity';

@Index('PK_PULSE_DATA_CHANNEL', ['id'], { unique: true })
@Entity('pulseDataChannel', { schema: 'dbo' })
export class PulseDataChannel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('nvarchar', { name: 'dataMappingInfo', length: 120 })
  dataMappingInfo!: string;

  @Column('datetime2', {
    name: 'createdAt',
    default: () => 'getdate()',
  })
  createdAt!: Date;

  @OneToOne(() => Meter, (meter) => meter.pulseDataChannel)
  @JoinColumn([{ name: 'meterId', referencedColumnName: 'id' }])
  meter!: Meter;

  @ManyToOne(() => DataSource, (dataSource) => dataSource.pulseDataChannel)
  @JoinColumn([{ name: 'dataSourceId', referencedColumnName: 'id' }])
  dataSource!: DataSource;
}
