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
import { Location } from './data.location.entity';
import { MediaCalculatedData } from './data.media-calculated-data.entity';
import { MediaMeasurement } from './data.media-measurement.entity';

@Index('PK_COUNTERS', ['id'], { unique: true })
@Entity('COUNTERS', { schema: 'dbo' })
export class Counter {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id!: number;

  @Column('nvarchar', { name: 'SYMBOL', length: 50 })
  symbol!: string;

  @Column('nvarchar', { name: 'NAME', length: 50 })
  name!: string;

  @ManyToOne(() => Location, (location) => location.counter)
  @JoinColumn([{ name: 'LOCATION_ID', referencedColumnName: 'id' }])
  location!: Location;

  @OneToOne(
    () => MediaCalculatedData,
    (mediaCalculatedData) => mediaCalculatedData.counter,
  )
  mediaCalculatedData!: MediaCalculatedData;

  @OneToMany(
    () => MediaMeasurement,
    (mediaMeasurements) => mediaMeasurements.counter,
  )
  mediaMeasurement!: MediaMeasurement[];
}
