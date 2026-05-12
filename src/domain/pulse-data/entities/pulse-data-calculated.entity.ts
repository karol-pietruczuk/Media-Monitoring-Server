import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meter } from '../../meter/entities/meter.entity';

@Index('PK_PULSE_DATA_CALCULATED', ['id'], { unique: true })
@Index('UQ__PULSE_DATA_CALCULATED_METER_ID', ['meterId'], { unique: true })
@Entity('pulseDataCalculated', { schema: 'dbo' })
export class PulseDataCalculated {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('bigint', { name: 'pulsesAfterLastCalibration' })
  pulsesAfterLastCalibration!: number;

  @Column('numeric', { name: 'actualValue', precision: 17, scale: 4 })
  actualValue!: number;

  @Column('datetime', { name: 'actualTimestamp', default: () => 'getdate()' })
  actualTimestamp!: Date;

  @Column('int', { name: 'meterId', unique: true })
  meterId!: number;

  @Column('datetime', {
    name: 'createdAt',
    unique: true,
    default: () => 'getdate()',
  })
  createdAt!: Date;

  @OneToOne(() => Meter, (meter) => meter.pulseDataCalculated)
  @JoinColumn([{ name: 'meterId', referencedColumnName: 'id' }])
  meter!: Meter;
}
