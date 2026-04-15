import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Counter } from './data.counter.entity';

@Index('PK_MEDIA_MEASUREMENTS', ['id'], { unique: true })
@Index('UQ_MEDIA_MEASUREMENTS_TIMESTAMP', ['timestamp'], { unique: true })
@Entity('MEDIA_MEASUREMENTS', { schema: 'dbo' })
export class MediaMeasurement {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id!: number;

  @Column('int', { name: 'COUNTER_PULSES' })
  counterPulses!: number;

  @Column('datetime', {
    name: 'TIMESTAMP',
    unique: true,
    default: () => 'getdate()',
  })
  timestamp!: Date;

  @ManyToOne(() => Counter, (counter) => counter.mediaMeasurement)
  @JoinColumn([{ name: 'COUNTER_ID', referencedColumnName: 'id' }])
  counter!: Counter;
}
