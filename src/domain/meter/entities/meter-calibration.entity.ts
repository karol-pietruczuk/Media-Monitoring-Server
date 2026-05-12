import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meter } from './meter.entity';

@Index('PK_CALIBRATION', ['id'], { unique: true })
@Entity('calibration', { schema: 'dbo' })
export class MeterCalibration {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('numeric', { name: 'value', precision: 17, scale: 4 })
  value!: number;

  // dodaj kolumnę CalculateMultiplier: none | start | stop

  @Column('datetime', { name: 'timestamp', unique: true })
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
