import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { MeterCalibration } from './meter-calibration.entity';
import { User } from '../../user/entities/user.entity';
import type { MeterCalibrationChange } from '../../../core/enums/meter-calibration-change.enum';

@Index('PK_METER_CALIBRATION_HISTORY', ['id'], { unique: true })
@Entity('meterCalibrationHistory', { schema: 'dbo' })
export class MeterCalibrationHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({ type: 'int', name: 'meterCalibrationId' })
  meterCalibrationId!: number;

  @Column({ type: 'int', name: 'changedById', nullable: true })
  changedById!: number | null;

  @Column({ type: 'nvarchar', name: 'meterCalibrationChangeType', length: 50 })
  meterCalibrationChangeType!: MeterCalibrationChange;

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    name: 'oldValues',
    nullable: true,
  })
  oldValues!: string | null;

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    name: 'newValues',
    nullable: true,
  })
  newValues!: string | null;

  @CreateDateColumn({ type: 'datetime2', name: 'createdAt' })
  createdAt!: Date;

  @ManyToOne(() => MeterCalibration, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'meterCalibrationId' })
  meterCalibration!: MeterCalibration;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'changedById' })
  changedBy!: User;
}
