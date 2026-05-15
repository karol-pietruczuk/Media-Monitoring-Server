import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meter } from './meter.entity';
import { PulseDataMultiplier } from '../../pulse-data/entities/pulse-data-multiplier.entity';

@Index('PK_METER_CALIBRATION', ['id'], { unique: true })
@Entity('meterCalibration', { schema: 'dbo' })
export class MeterCalibration {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('numeric', { name: 'value', precision: 17, scale: 4 })
  value!: number;

  @Column('datetime2', { name: 'timestamp' })
  timestamp!: Date;

  @Column('datetime2', {
    name: 'createdAt',
    default: () => 'getdate()',
  })
  createdAt!: Date;

  @ManyToOne(() => Meter, (meter) => meter.meterCalibration)
  @JoinColumn([{ name: 'meterId', referencedColumnName: 'id' }])
  meter!: Meter;

  @OneToMany(
    () => PulseDataMultiplier,
    (pulseDataMultiplier) => pulseDataMultiplier.meterCalibrationStart,
  )
  pulseDataMultiplierStart!: PulseDataMultiplier[];

  @OneToMany(
    () => PulseDataMultiplier,
    (pulseDataMultiplier) => pulseDataMultiplier.meterCalibrationStop,
  )
  pulseDataMultiplierStop!: PulseDataMultiplier[];
}
