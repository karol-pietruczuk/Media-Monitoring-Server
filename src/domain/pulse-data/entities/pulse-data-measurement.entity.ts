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
@Entity('pulseDataMeasurement', { schema: 'dbo' })
@Index('IX_PULSE_DATA_MEASUREMENT', ['timestamp', 'meter'])
export class PulseDataMeasurement {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('int', { name: 'pulses' })
  pulses!: number;

  @Column('datetime2', {
    name: 'timestamp',
    default: () => 'getdate()',
  })
  timestamp!: Date;

  @Column('datetime2', {
    name: 'createdAt',
    default: () => 'getdate()',
  })
  createdAt!: Date;

  @ManyToOne(() => Meter, (meter) => meter.pulseDatameasurement)
  @JoinColumn([{ name: 'meterId', referencedColumnName: 'id' }])
  meter!: Meter;
}
