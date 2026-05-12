import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from '../../location/entities/location.entity';
import { MeterCalibration } from './meter-calibration.entity';
import { Unit } from '../../../core/type/unit';
import { Meter } from './meter.entity';
import { PulseDataCalculated } from '../../pulse-data/entities/pulse-data-calculated.entity';
import type { MeterHistoryChange } from '../../../core/type/meter-history-change';
import { PulseDataMeasurement } from '../../pulse-data/entities/pulse-data-measurement.entity';
import { PulseDataMultiplier } from '../../pulse-data/entities/pulse-data-multiplier.entity';
import { PulseDataMultiplierHistory } from '../../pulse-data/entities/pulse-data-multiplier-history.entity';

@Index('PK_METER_HISTORY', ['id'], { unique: true })
@Entity('meterHistory', { schema: 'dbo' })
export class MeterHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('nvarchar', { name: 'name', length: 50 })
  name!: string;

  @Column('nvarchar', { name: 'symbol', length: 50 })
  symbol!: string;

  @Column({
    type: 'simple-enum',
    enum: Unit,
    name: 'unit',
    default: Unit.cubicMeter,
    length: 30,
  })
  unit!: Unit;

  @Column('datetime', {
    name: 'createdAt',
    default: () => 'getdate()',
  })
  createdAt!: Date;

  @Column({
    type: 'nvarchar',
    name: 'meterHistoryChange',
    length: 30,
  })
  meterHistoryChange!: MeterHistoryChange;

  @ManyToOne(() => Location, (location) => location.meter)
  @JoinColumn([{ name: 'locationId', referencedColumnName: 'id' }])
  location!: Location;

  @OneToOne(() => PulseDataCalculated, (calculatedData) => calculatedData.meter)
  calculatedData!: PulseDataCalculated;

  @OneToMany(
    () => PulseDataMeasurement,
    (pulseDataMeasurement) => pulseDataMeasurement.meter,
  )
  pulseDataMeasurement!: PulseDataMeasurement[];

  @OneToMany(
    () => MeterCalibration,
    (meterCalibration) => meterCalibration.meter,
  )
  meterCalibration!: MeterCalibration[];

  @OneToMany(
    () => PulseDataMultiplier,
    (pulseDataMultiplier) => pulseDataMultiplier.meter,
  )
  pulseDataMultiplier!: PulseDataMultiplier[];

  @OneToMany(
    () => PulseDataMultiplierHistory,
    (pulseDataMultiplierHistory) => pulseDataMultiplierHistory.meter,
  )
  pulseDataMultiplierHistory!: PulseDataMultiplierHistory[];

  @ManyToOne(() => Meter, (meter) => meter.meterHistory)
  @JoinColumn([{ name: 'meterId', referencedColumnName: 'id' }])
  meter!: Meter;
}
