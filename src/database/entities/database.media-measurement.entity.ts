import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Counter } from './database.counter.entity';

@Index('PK_MEDIA_MEASUREMENT', ['id'], { unique: true })
@Index('UQ_MEDIA_MEASUREMENT_TIMESTAMP', ['timestamp'], { unique: true })
@Entity('mediaMeasurement', { schema: 'dbo' })
export class MediaMeasurement {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('int', { name: 'counterPulses' })
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

  @ManyToOne(() => Counter, (counter) => counter.mediaMeasurement)
  @JoinColumn([{ name: 'counterId', referencedColumnName: 'id' }])
  counter!: Counter;
}
