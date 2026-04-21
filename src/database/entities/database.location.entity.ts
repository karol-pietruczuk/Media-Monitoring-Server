import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Counter } from './database.counter.entity';

@Index('PK_LOCATION', ['id'], { unique: true })
@Entity('location', { schema: 'dbo' })
export class Location {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('nvarchar', { name: 'mainLocation', length: 50 })
  mainLocation!: string;

  @Column('nvarchar', { name: 'subLocation', nullable: true, length: 50 })
  subLocation!: string | null;

  @Column('datetime', {
    name: 'createdAt',
    unique: true,
    default: () => 'getdate()',
  })
  createdAt!: Date;

  @OneToMany(() => Counter, (counter) => counter.location)
  counter!: Counter[];
}
