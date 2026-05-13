import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import type { DataSourceProtocol } from '../../../core/type/data-source-protocol';
import type { DataSourceHistoryChangetype } from '../../../core/type/data-source-history-change';

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
  dataSourceChange!: DataSourceHistoryChangetype;

  @Column({ type: 'int', name: 'dataSourceId' })
  dataSourceId!: number;

  @Column('nvarchar', { name: 'dataSourceProtocol', length: 30 })
  dataSourceProtocol!: DataSourceProtocol;

  @Column('nvarchar', { name: 'dataSourceConnectionInfo', length: 120 })
  dataSourceConnectionInfo!: string;

  @Column('datetime', {
    name: 'dataSourcCreatedAt',
  })
  dataSourcCreatedAt!: Date;

  @Column('datetime', {
    name: 'createdAt',
    default: () => 'getdate()',
  })
  createdAt!: Date;
}
