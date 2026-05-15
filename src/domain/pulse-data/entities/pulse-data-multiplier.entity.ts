import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meter } from '../../meter/entities/meter.entity';
import { MeterCalibration } from '../../meter/entities/meter-calibration.entity';

@Index('PK_PULSE_DATA_MULTIPLIER', ['id'], { unique: true })
@Entity('pulseDataMultiplier', { schema: 'dbo' })
export class PulseDataMultiplier {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('numeric', { name: 'value', precision: 15, scale: 10 })
  value!: number;

  @Column('datetime2', {
    name: 'expirationDateFrom',
    nullable: false,
  })
  expirationDateFrom!: Date;

  @Column('datetime2', {
    name: 'expirationDateUntil',
    nullable: true,
  })
  expirationDateUntil!: Date;

  @Column('datetime2', {
    name: 'createdAt',
    default: () => 'getdate()',
  })
  createdAt!: Date;

  @ManyToOne(() => Meter, (meter) => meter.pulseDataMultiplier)
  @JoinColumn([{ name: 'meterId', referencedColumnName: 'id' }])
  meter!: Meter;

  @ManyToOne(
    () => MeterCalibration,
    (meterCalibrationStart) => meterCalibrationStart.pulseDataMultiplierStart,
  )
  @JoinColumn([{ name: 'meterCalibrationStart', referencedColumnName: 'id' }])
  meterCalibrationStart!: MeterCalibration;

  @ManyToOne(
    () => MeterCalibration,
    (meterCalibrationStop) => meterCalibrationStop.pulseDataMultiplierStop,
  )
  @JoinColumn([{ name: 'meterCalibrationStop', referencedColumnName: 'id' }])
  meterCalibrationStop!: MeterCalibration;
}
