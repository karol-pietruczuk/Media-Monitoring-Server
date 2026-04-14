import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Counters } from './data.counters.entity';

@Index('PK_LOCATION', ['id'], { unique: true })
@Entity('LOCATIONS', { schema: 'dbo' })
export class Locations {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id!: number;

  @Column('nvarchar', { name: 'MAIN_LOCATION', length: 50 })
  mainLocation!: string;

  @Column('nvarchar', { name: 'SUB_LOCATION', nullable: true, length: 50 })
  subLocation!: string | null;

  @OneToMany(() => Counters, (counters) => counters.location)
  counters!: Counters[];
}
