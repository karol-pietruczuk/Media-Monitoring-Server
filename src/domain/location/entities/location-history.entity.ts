import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import type { LocationChangetype } from '../../../core/type/location-change.type';

@Index('PK_LOCATION_HISTORY', ['id'], { unique: true })
@Entity('locationHistory', { schema: 'dbo' })
export class LocationHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({
    type: 'nvarchar',
    name: 'locationChangetype',
    length: 30,
  })
  locationChangetype!: LocationChangetype;

  @Column({ type: 'int', name: 'locationId' })
  locationId!: number;

  @Column('nvarchar', { name: 'locationMainLocation', length: 50 })
  locationMainLocation!: string;

  @Column('nvarchar', {
    name: 'locationSubLocation',
    nullable: true,
    length: 50,
  })
  locationSubLocation!: string | null;

  @Column('datetime2', {
    name: 'locationCreatedAt',
    default: () => 'getdate()',
  })
  locationCreatedAt!: Date;

  @Column('datetime2', {
    name: 'createdAt',
    default: () => 'getdate()',
  })
  createdAt!: Date;
}
