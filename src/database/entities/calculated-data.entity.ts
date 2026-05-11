import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Counter } from './counter.entity';

@Index('PK_CALCULATED_DATA', ['id'], { unique: true })
@Index('UQ__CALCULATED_DATA_COUNTER_ID', ['counterId'], { unique: true })
@Entity('calculatedData', { schema: 'dbo' })
export class CalculatedData {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('bigint', { name: 'pulsesAfterLastCalibration' })
  pulsesAfterLastCalibration!: number;

  @Column('numeric', { name: 'actualValue', precision: 17, scale: 4 })
  actualValue!: number;

  @Column('datetime', { name: 'actualTimestamp', default: () => 'getdate()' })
  actualTimestamp!: Date;

  @Column('int', { name: 'counterId', unique: true })
  counterId!: number;

  @Column('datetime', {
    name: 'createdAt',
    unique: true,
    default: () => 'getdate()',
  })
  createdAt!: Date;

  @OneToOne(() => Counter, (counter) => counter.calculatedData)
  @JoinColumn([{ name: 'counterId', referencedColumnName: 'id' }])
  counter!: Counter;
}
