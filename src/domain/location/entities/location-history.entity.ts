import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Location } from './location.entity';
import { User } from '../../user/entities/user.entity';
import type { LocationChange } from '../../../core/enums/location-change.enum';

@Index('PK_Location_History', ['id'], { unique: true })
@Entity('location_history', { schema: 'dbo' })
export class LocationHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({ type: 'int', name: 'locationId' })
  locationId!: number; // ID lokalizacji, która uległa zmianie

  @Column({ type: 'int', name: 'changedById', nullable: true })
  changedById!: number | null; // ID zalogowanego operatora wykonującego akcję

  @Column({ type: 'nvarchar', length: 50, name: 'action' })
  action!: LocationChange; // np. 'LOCATION_CREATED', 'LOCATION_UPDATED', 'LOCATION_DELETED'

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    name: 'oldValues',
    nullable: true,
  })
  oldValues!: string | null; // Stan przed zmianą w formacie JSON

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    name: 'newValues',
    nullable: true,
  })
  newValues!: string | null; // Stan po zmianie w formacie JSON

  @CreateDateColumn({ type: 'datetime2', name: 'createdAt' })
  createdAt!: Date;

  // Bezpieczna relacja logiczna (bez klucza obcego w bazie MSSQL)
  @ManyToOne(() => Location, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'locationId' })
  location!: Location;

  // Powiązanie z użytkownikiem, który dokonał modyfikacji
  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'changedById' })
  changedBy!: User;
}
