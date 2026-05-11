import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Counter } from './counter.entity';
import type { MultiplierHistoryChange } from '../../types/multiplier-history-change';
import { Multiplier } from './multiplier.entity';

@Index('PK_MULTIPLIER_HISTORY', ['id'], { unique: true })
@Entity('multiplierHistory', { schema: 'dbo' })
export class MultiplierHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('numeric', { name: 'multiplierHistory', precision: 15, scale: 10 })
  value!: number;

  @Column('datetime', {
    name: 'expirationDateFrom',
    nullable: false,
  })
  expirationDateFrom!: Date;

  @Column('datetime', {
    name: 'expirationDateUntil',
    nullable: true,
  })
  expirationDateUntil!: Date;

  @Column('datetime', {
    name: 'createdAt',
    default: () => 'getdate()',
  })
  createdAt!: Date;

  @Column({
    type: 'nvarchar',
    name: 'multiplierHistoryChange',
    length: 30,
  })
  multiplierHistoryChange!: MultiplierHistoryChange;

  @ManyToOne(() => Counter, (counter) => counter.multiplierHistory)
  @JoinColumn([{ name: 'counterId', referencedColumnName: 'id' }])
  counter!: Counter;

  @ManyToOne(() => Multiplier, (multiplier) => multiplier.multiplierHistory)
  @JoinColumn([{ name: 'multiplierId', referencedColumnName: 'id' }])
  multiplier!: Multiplier;
}
