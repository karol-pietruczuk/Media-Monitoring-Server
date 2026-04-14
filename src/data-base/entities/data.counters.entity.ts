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
import { Locations } from './data.locations.entity';
import { MediaCalculatedData } from './data.media-calculated-data.entity';
import { MediaMeasurements } from './data.media-measurements.entity';

@Index('PK_COUNTERS', ['id'], { unique: true })
@Entity('COUNTERS', { schema: 'dbo' })
export class Counters {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id!: number;

  @Column('nvarchar', { name: 'SYMBOL', length: 50 })
  symbol!: string;

  @Column('nvarchar', { name: 'NAME', length: 50 })
  name!: string;

  @ManyToOne(() => Locations, (locations) => locations.counters)
  @JoinColumn([{ name: 'LOCATION_ID', referencedColumnName: 'id' }])
  location!: Locations;

  @OneToOne(
    () => MediaCalculatedData,
    (mediaCalculatedData) => mediaCalculatedData.counters,
  )
  mediaCalculatedData!: MediaCalculatedData;

  @OneToMany(
    () => MediaMeasurements,
    (mediaMeasurements) => mediaMeasurements.counter,
  )
  mediaMeasurements!: MediaMeasurements[];
}
