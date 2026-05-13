import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meter } from '../../meter/entities/meter.entity';

@Index('PK_PULSE_DATA_MEASUREMENT', ['id'], { unique: true })
@Index('UQ_PULSE_DATA_MEASUREMENT_TIMESTAMP', ['timestamp'], {
  unique: true,
})
@Entity('pulseDataMeasurement', { schema: 'dbo' })
export class PulseDataMeasurement {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('int', { name: 'meterPulses' })
  pulses!: number;

  @Column('datetime', {
    name: 'timestamp',
    unique: true,
    default: () => 'getdate()',
  })
  timestamp!: Date;

  @Column('datetime', {
    name: 'createdAt',
    unique: true,
    default: () => 'getdate()',
  })
  createdAt!: Date;

  @ManyToOne(() => Meter, (meter) => meter.pulseDatameasurement)
  @JoinColumn([{ name: 'meterId', referencedColumnName: 'id' }])
  meter!: Meter;
}
