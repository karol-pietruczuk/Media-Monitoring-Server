import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meter } from './meter.entity';
import type { MeterCalibrationToCalculateMultiplier } from '../../../core/type/meter-calibration-to-calculate-multiplier';

@Index('PK_METER_CALIBRATION', ['id'], { unique: true })
@Entity('meterCalibration', { schema: 'dbo' })
export class MeterCalibration {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('numeric', { name: 'value', precision: 17, scale: 4 })
  value!: number;

  @Column({
    type: 'nvarchar',
    name: 'useToCalculateMultiplier',
    length: 30,
  })
  useToCalculateMultiplier!: MeterCalibrationToCalculateMultiplier;

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
