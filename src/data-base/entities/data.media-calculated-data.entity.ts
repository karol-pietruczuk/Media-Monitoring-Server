import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Counter } from './data.counter.entity';

@Index('PK_MEDIA_CALCULATED_DATA', ['id'], { unique: true })
@Index('UQ__MEDIA_CA__08ABF5E959946735', ['countersId'], { unique: true })
@Entity('MEDIA_CALCULATED_DATA', { schema: 'dbo' })
export class MediaCalculatedData {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id!: number;

  @Column('numeric', { name: 'CALIBRATION_VALUE_M3', precision: 17, scale: 4 })
  calibrationValueM3!: number;

  @Column('datetime', {
    name: 'CALIBRATION_TIMESTAMP',
    default: () => 'getdate()',
  })
  calibrationTimestamp!: Date;

  @Column('numeric', { name: 'MULTIPLIER', precision: 15, scale: 10 })
  multiplier!: number;

  @Column('numeric', { name: 'ACTUAL_VALUE_M3', precision: 17, scale: 4 })
  actualValueM3!: number;

  @Column('datetime', { name: 'ACTUAL_TIMESTAMP', default: () => 'getdate()' })
  actualTimestamp!: Date;

  @Column('int', { name: 'COUNTERS_ID', unique: true })
  countersId!: number;

  @Column('bigint', { name: 'PULSES_AFTER_CALIBRATION' })
  pulsesAfterCalibration!: string;

  @OneToOne(() => Counter, (counter) => counter.mediaCalculatedData)
  @JoinColumn([{ name: 'COUNTERS_ID', referencedColumnName: 'id' }])
  counter!: Counter;
}
