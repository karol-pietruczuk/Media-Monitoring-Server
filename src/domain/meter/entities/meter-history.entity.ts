import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Unit } from '../../../core/enums/unit.enum';
import type { MeterChange } from '../../../core/enums/meter-change.enum';

@Index('PK_METER_HISTORY', ['id'], { unique: true })
@Entity('meterHistory', { schema: 'dbo' })
export class MeterHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({
    type: 'nvarchar',
    name: 'meterChange',
    length: 30,
  })
  meterChange!: MeterChange;

  @Column({ type: 'int', name: 'meterId' })
  meterId!: number;

  @Column('nvarchar', { name: 'meterName', length: 50 })
  meterName!: string;

  @Column('nvarchar', { name: 'meterSymbol', length: 50 })
  meterSymbol!: string;

  @Column({
    type: 'nvarchar',
    name: 'meterUnit',
    default: Unit.CubicMeter,
    length: 30,
  })
  meterUnit!: Unit;

  @Column({ type: 'int', name: 'meterLocationId' })
  meterLocationId!: number;

  @Column('datetime2', {
    name: 'meterCreatedAt',
  })
  meterCreatedAt!: Date;

  @Column('datetime2', {
    name: 'createdAt',
    default: () => 'getdate()',
  })
  createdAt!: Date;
}
