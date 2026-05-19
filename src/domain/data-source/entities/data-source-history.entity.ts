import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import type { DataSourceProtocol } from '../../../core/enums/data-source-protocol.enum';
import type { DataSourceChange } from '../../../core/enums/data-source-change.enum';

@Index('PK_DATA_SOURCE_HISTORY', ['id'], { unique: true })
@Entity('dataSourceHistory', { schema: 'dbo' })
export class DataSourceHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({
    type: 'nvarchar',
    name: 'dataSourceChange',
    length: 30,
  })
  dataSourceChange!: DataSourceChange;

  @Column({ type: 'int', name: 'dataSourceId' })
  dataSourceId!: number;

  @Column('nvarchar', { name: 'dataSourceProtocol', length: 30 })
  dataSourceProtocol!: DataSourceProtocol;

  @Column('nvarchar', { name: 'dataSourceConnectionInfo', length: 120 })
  dataSourceConnectionInfo!: string;

  @Column('datetime2', {
    name: 'dataSourcCreatedAt',
  })
  dataSourcCreatedAt!: Date;

  @Column('datetime2', {
    name: 'createdAt',
    default: () => 'getdate()',
  })
  createdAt!: Date;
}
