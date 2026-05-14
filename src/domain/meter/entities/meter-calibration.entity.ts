import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meter } from './meter.entity';

@Index('PK_METER_CALIBRATION', ['id'], { unique: true })
@Entity('meterCalibration', { schema: 'dbo' })
export class MeterCalibration {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('numeric', { name: 'value', precision: 17, scale: 4 })
  value!: number;

  @Column('datetime', { name: 'timestamp' })
  timestamp!: Date;

  @Column('datetime', {
    name: 'createdAt',
    default: () => 'getdate()',
  })
  createdAt!: Date;

  @ManyToOne(() => Meter, (meter) => meter.meterCalibration)
  @JoinColumn([{ name: 'meterId', referencedColumnName: 'id' }])
  meter!: Meter;
}
