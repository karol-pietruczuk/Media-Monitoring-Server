import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meter } from '../../meter/entities/meter.entity';

@Index('PK_TOTAL_DATA_MEASUREMENT', ['id'], { unique: true })
@Entity('totalDataMeasurement', { schema: 'dbo' })
@Index('IX_TOTAL_DATA_MEASUREMENT', ['timestamp', 'meter'])
export class TotalDataMeasurement {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('decimal', { name: 'value', precision: 10, scale: 3 })
  value!: number;

  @Column('datetime', {
    name: 'timestamp',
    default: () => 'getdate()',
  })
  timestamp!: Date;

  @Column('datetime', {
    name: 'createdAt',
    default: () => 'getdate()',
  })
  createdAt!: Date;

  @ManyToOne(() => Meter, (meter) => meter.totalDatameasurement)
  @JoinColumn([{ name: 'meterId', referencedColumnName: 'id' }])
  meter!: Meter;
}
