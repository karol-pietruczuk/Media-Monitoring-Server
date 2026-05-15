import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import type { MeterCalibrationChangeType } from '../../../core/type/meter-calibration-change.type';

@Index('PK_METER_CALIBRATION_HISTORY', ['id'], { unique: true })
@Entity('meterCalibrationHistory', { schema: 'dbo' })
export class MeterCalibrationHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({
    type: 'nvarchar',
    name: 'meterCalibrationChangeType',
    length: 30,
  })
  meterCalibrationChangeType!: MeterCalibrationChangeType;

  @Column({ type: 'int', name: 'meterCalibrationId' })
  meterCalibrationId!: number;

  @Column('numeric', { name: 'meterCalibrationValue', precision: 17, scale: 4 })
  meterCalibrationValue!: number;

  @Column('datetime2', { name: 'meterCalibrationTimestamp' })
  meterCalibrationTimestamp!: Date;

  @Column('datetime2', {
    name: 'meterCalibrationCreatedAt',
  })
  meterCalibrationCreatedAt!: Date;

  @Column({ type: 'int', name: 'meterCalibrationMeterId' })
  meterCalibrationMeterId!: number;

  @Column('datetime2', {
    name: 'createdAt',
    default: () => 'getdate()',
  })
  createdAt!: Date;
}
