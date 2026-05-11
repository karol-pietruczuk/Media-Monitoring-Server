import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Counter } from './counter.entity';
import { MultiplierHistory } from './multiplier-history.entity';

@Index('PK_MULTIPLIER', ['id'], { unique: true })
@Entity('multiplier', { schema: 'dbo' })
export class Multiplier {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('numeric', { name: 'multiplier', precision: 15, scale: 10 })
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

  @ManyToOne(() => Counter, (counter) => counter.multiplier)
  @JoinColumn([{ name: 'counterId', referencedColumnName: 'id' }])
  counter!: Counter;

  @OneToMany(
    () => MultiplierHistory,
    (multiplierHistory) => multiplierHistory.multiplier,
  )
  multiplierHistory!: MultiplierHistory[];
}
