import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Counter } from './database.counter.entity';

@Index('PK_MEDIA_CALCULATED_DATA', ['id'], { unique: true })
@Index('UQ__MEDIA_CALCULATED_DATA_COUNTER_ID', ['counterId'], { unique: true })
@Entity('mediaCalculatedData', { schema: 'dbo' })
export class MediaCalculatedData {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ids' })
  id!: number;

  @Column('numeric', { name: 'calibrationValueM3', precision: 17, scale: 4 })
  calibrationValueM3!: number;

  @Column('datetime', {
    name: 'calibrationTimestamp',
    default: () => 'getdate()',
  })
  calibrationTimestamp!: Date;

  @Column('numeric', { name: 'multiplier', precision: 15, scale: 10 })
  multiplier!: number;

  @Column('numeric', { name: 'actualValueM3', precision: 17, scale: 4 })
  actualValueM3!: number;

  @Column('datetime', { name: 'actualTimestamp', default: () => 'getdate()' })
  actualTimestamp!: Date;

  @Column('int', { name: 'counterId', unique: true })
  counterId!: number;

  @Column('bigint', { name: 'pulsesAfterCalibration' })
  pulsesAfterCalibration!: string;

  @Column('datetime', {
    name: 'createdAt',
    unique: true,
    default: () => 'getdate()',
  })
  createdAt!: Date;

  @OneToOne(() => Counter, (counter) => counter.mediaCalculatedData)
  @JoinColumn([{ name: 'counterId', referencedColumnName: 'id' }])
  counter!: Counter;
}
