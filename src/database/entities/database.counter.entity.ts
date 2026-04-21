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
import { Location } from './database.location.entity';
import { MediaCalculatedData } from './database.media-calculated-data.entity';
import { MediaMeasurement } from './database.media-measurement.entity';

@Index('PK_COUNTER', ['id'], { unique: true })
@Entity('counter', { schema: 'dbo' })
export class Counter {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('nvarchar', { name: 'symbol', length: 50 })
  symbol!: string;

  @Column('nvarchar', { name: 'name', length: 50 })
  name!: string;

  @ManyToOne(() => Location, (location) => location.counter)
  @JoinColumn([{ name: 'locationId', referencedColumnName: 'id' }])
  location!: Location;

  @Column('datetime', {
    name: 'createdAt',
    unique: true,
    default: () => 'getdate()',
  })
  createdAt!: Date;

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
