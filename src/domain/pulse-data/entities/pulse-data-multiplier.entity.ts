import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meter } from '../../meter/entities/meter.entity';
import { PulseDataMultiplierHistory } from './pulse-data-multiplier-history.entity';

@Index('PK_PULSE_DATA_MULTIPLIER', ['id'], { unique: true })
@Entity('pulseDataMultiplier', { schema: 'dbo' })
export class PulseDataMultiplier {
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

  @ManyToOne(() => Meter, (meter) => meter.pulseDataMultiplier)
  @JoinColumn([{ name: 'meterId', referencedColumnName: 'id' }])
  meter!: Meter;

  @OneToMany(
    () => PulseDataMultiplierHistory,
    (pulseDataMultiplierHistory) =>
      pulseDataMultiplierHistory.pulseDataMultiplier,
  )
  pulseDataMultiplierHistory!: PulseDataMultiplierHistory[];
}
