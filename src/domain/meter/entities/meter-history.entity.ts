import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Unit } from '../../../core/type/unit';
import type { MeterHistoryChangeType } from '../../../core/type/meter-history-change';

@Index('PK_METER_HISTORY', ['id'], { unique: true })
@Entity('meterHistory', { schema: 'dbo' })
export class MeterHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({
    type: 'nvarchar',
    name: 'meterHistoryChange',
    length: 30,
  })
  meterHistoryChange!: MeterHistoryChangeType;

  @Column({ type: 'int', name: 'meterId' })
  meterId!: number;

  @Column('nvarchar', { name: 'meterName', length: 50 })
  meterName!: string;

  @Column('nvarchar', { name: 'meterSymbol', length: 50 })
  meterSymbol!: string;

  @Column({
    type: 'nvarchar',
    name: 'meterUnit',
    default: Unit.cubicMeter,
    length: 30,
  })
  meterUnit!: Unit;

  @Column({ type: 'int', name: 'meterLocationId' })
  meterLocationId!: number;

  @Column('datetime', {
    name: 'meterCreatedAt',
  })
  meterCreatedAt!: Date;

  @Column('datetime', {
    name: 'createdAt',
    default: () => 'getdate()',
  })
  createdAt!: Date;
}
