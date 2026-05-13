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

@Index('PK_TOTAL_DATA_CHANNEL', ['id'], { unique: true })
@Entity('totalDataChannel', { schema: 'dbo' })
export class TotalDataChannel {
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

  @OneToOne(() => Meter, (meter) => meter.totalDataChannel)
  @JoinColumn([{ name: 'meterId', referencedColumnName: 'id' }])
  meter!: Meter;

  @ManyToOne(() => DataSource, (dataSource) => dataSource.totalDataChannel)
  @JoinColumn([{ name: 'dataSourceId', referencedColumnName: 'id' }])
  dataSource!: DataSource;
}
