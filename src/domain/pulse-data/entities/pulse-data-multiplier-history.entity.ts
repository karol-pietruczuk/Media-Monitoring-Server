import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { MultiplierHistoryChangeType } from '../../../core/type/multiplier-history-change';
import { Meter } from '../../meter/entities/meter.entity';
import { PulseDataMultiplier } from './pulse-data-multiplier.entity';

@Index('PK_PULSE_DATA_MULTIPLIER_HISTORY', ['id'], { unique: true })
@Entity('pulseDataMultiplierHistory', { schema: 'dbo' })
export class PulseDataMultiplierHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('numeric', {
    name: 'multiplier',
    precision: 15,
    scale: 10,
  })
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
  multiplierHistoryChange!: MultiplierHistoryChangeType;

  @ManyToOne(() => Meter, (meter) => meter.pulseDataMultiplierHistory)
  @JoinColumn([{ name: 'meterId', referencedColumnName: 'id' }])
  meter!: Meter;

  @ManyToOne(
    () => PulseDataMultiplier,
    (pulseDataMultiplier) => pulseDataMultiplier.pulseDataMultiplierHistory,
  )
  @JoinColumn([{ name: 'multiplierId', referencedColumnName: 'id' }])
  pulseDataMultiplier!: PulseDataMultiplier;
}
