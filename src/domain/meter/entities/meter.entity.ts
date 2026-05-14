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
import { Unit } from '../../../core/type/unit';
import { PulseDataCalculated } from '../../pulse-data/entities/pulse-data-calculated.entity';
import { MeterCalibration } from './meter-calibration.entity';
import { PulseDataMultiplier } from '../../pulse-data/entities/pulse-data-multiplier.entity';
import { Location } from '../../location/entities/location.entity';
import { PulseDataMeasurement } from '../../pulse-data/entities/pulse-data-measurement.entity';
import { PulseDataChannel } from '../../pulse-data/entities/pulse-data-channel.entity';
import { TotalDataChannel } from '../../total-data/entities/total-data-channel.entity';
import { TotalDataMeasurement } from '../../total-data/entities/total-data-measurement.entity';

@Index('PK_Meter', ['id'], { unique: true })
@Entity('meter', { schema: 'dbo' })
export class Meter {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('nvarchar', { name: 'name', length: 50 })
  name!: string;

  @Column('nvarchar', { name: 'symbol', length: 50 })
  symbol!: string;

  @Column({
    type: 'nvarchar',
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

  @ManyToOne(() => Location, (location) => location.meter)
  @JoinColumn([{ name: 'locationId', referencedColumnName: 'id' }])
  location!: Location;

  @OneToOne(
    () => PulseDataCalculated,
    (pulseDataCalculated) => pulseDataCalculated.meter,
  )
  pulseDataCalculated!: PulseDataCalculated;

  @OneToMany(
    () => PulseDataMeasurement,
    (pulseDatameasurement) => pulseDatameasurement.meter,
  )
  pulseDatameasurement!: PulseDataMeasurement[];

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

  @OneToOne(
    () => PulseDataChannel,
    (pulseDataChannel) => pulseDataChannel.meter,
  )
  pulseDataChannel!: PulseDataChannel;

  @OneToOne(
    () => TotalDataChannel,
    (totalDataChannel) => totalDataChannel.meter,
  )
  totalDataChannel!: TotalDataChannel;

  @OneToMany(
    () => TotalDataMeasurement,
    (totalDatameasurement) => totalDatameasurement.meter,
  )
  totalDatameasurement!: TotalDataMeasurement[];
}
