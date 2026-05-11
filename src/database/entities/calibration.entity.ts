import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Counter } from './counter.entity';

@Index('PK_CALIBRATION', ['id'], { unique: true })
@Entity('calibration', { schema: 'dbo' })
export class Calibration {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('numeric', { name: 'value', precision: 17, scale: 4 })
  value!: number;

  // dodaj kolumnę CalculateMultiplier: none | start | stop

  @Column('datetime', { name: 'timestamp', unique: true })
  timestamp!: Date;

  @Column('datetime', {
    name: 'createdAt',
    default: () => 'getdate()',
  })
  createdAt!: Date;

  @ManyToOne(() => Counter, (counter) => counter.calibration)
  @JoinColumn([{ name: 'counterId', referencedColumnName: 'id' }])
  counter!: Counter;
}
