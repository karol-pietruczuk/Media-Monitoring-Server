import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Counter } from './data.counter.entity';

@Index('PK_LOCATION', ['id'], { unique: true })
@Entity('LOCATIONS', { schema: 'dbo' })
export class Location {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id!: number;

  @Column('nvarchar', { name: 'MAIN_LOCATION', length: 50 })
  mainLocation!: string;

  @Column('nvarchar', { name: 'SUB_LOCATION', nullable: true, length: 50 })
  subLocation!: string | null;

  @OneToMany(() => Counter, (counter) => counter.location)
  counter!: Counter[];
}
