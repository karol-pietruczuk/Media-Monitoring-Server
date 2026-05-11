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
import { CalculatedData } from './calculated-data.entity';
import { Measurement } from './measurement.entity';
import { Calibration } from './calibration.entity';
import { Unit } from '../../types/unit';
import { Multiplier } from './multiplier.entity';
import { MultiplierHistory } from './multiplier-history.entity';
import { CounterHistory } from './counter-history.entity';

@Index('PK_COUNTER', ['id'], { unique: true })
@Entity('counter', { schema: 'dbo' })
export class Counter {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('nvarchar', { name: 'name', length: 50 })
  name!: string;

  @Column('nvarchar', { name: 'symbol', length: 50 })
  symbol!: string;

  @Column({
    type: 'nvarchar',
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

  @ManyToOne(() => Location, (location) => location.counter)
  @JoinColumn([{ name: 'locationId', referencedColumnName: 'id' }])
  location!: Location;

  @OneToOne(() => CalculatedData, (calculatedData) => calculatedData.counter)
  calculatedData!: CalculatedData;

  @OneToMany(() => Measurement, (measurement) => measurement.counter)
  measurement!: Measurement[];

  @OneToMany(() => Calibration, (calibration) => calibration.counter)
  calibration!: Calibration[];

  @OneToMany(() => Multiplier, (multiplier) => multiplier.counter)
  multiplier!: Multiplier[];

  @OneToMany(
    () => MultiplierHistory,
    (multiplierHistory) => multiplierHistory.counter,
  )
  multiplierHistory!: MultiplierHistory[];

  @OneToMany(() => CounterHistory, (counterHistory) => counterHistory.counter)
  counterHistory!: CounterHistory[];
}
