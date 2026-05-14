import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meter } from '../../meter/entities/meter.entity';

@Index('PK_PULSE_DATA_MULTIPLIER', ['id'], { unique: true })
@Entity('pulseDataMultiplier', { schema: 'dbo' })
export class PulseDataMultiplier {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('numeric', { name: 'value', precision: 15, scale: 10 })
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
}
