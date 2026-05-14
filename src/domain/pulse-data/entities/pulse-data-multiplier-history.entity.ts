import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import type { PulseDataMultiplierChangeType } from '../../../core/type/pulse-data-multiplier-change-type';

@Index('PK_PULSE_DATA_MULTIPLIER_HISTORY', ['id'], { unique: true })
@Entity('pulseDataMultiplierHistory', { schema: 'dbo' })
export class PulseDataMultiplierHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({
    type: 'nvarchar',
    name: 'pulseDataMultiplierHistoryChange',
    length: 30,
  })
  pulseDataMultiplierHistoryChange!: PulseDataMultiplierChangeType;

  @Column({ type: 'int', name: 'pulseDataMultiplierId' })
  pulseDataMultiplierId!: number;

  @Column('numeric', {
    name: 'pulseDataMultiplierValue',
    precision: 15,
    scale: 10,
  })
  pulseDataMultiplierValue!: number;

  @Column('datetime', {
    name: 'pulseDataMultiplierExpirationDateFrom',
    nullable: false,
  })
  pulseDataMultiplierExpirationDateFrom!: Date;

  @Column('datetime', {
    name: 'pulseDataExpirationDateUntil',
    nullable: true,
  })
  pulseDataExpirationDateUntil!: Date;

  @Column('datetime', {
    name: 'pulseDataMultiplierCreatedAt',
  })
  pulseDataMultiplierCreatedAt!: Date;

  @Column({ type: 'int', name: 'pulseDataMeterId' })
  pulseDataMeterId!: number;

  @Column({ type: 'int', name: 'meterCalibrationStartId' })
  meterCalibrationStartId!: number;

  @Column({ type: 'int', name: 'meterCalibrationStopId' })
  meterCalibrationStopId!: number;

  @Column('datetime', {
    name: 'createdAt',
    default: () => 'getdate()',
  })
  createdAt!: Date;
}
