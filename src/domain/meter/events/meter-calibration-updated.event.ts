import type { MeterCalibrationChange } from '../../../core/enums/meter-calibration-change.enum';

export class MeterCalibrationUpdatedEvent {
  constructor(
    public readonly calibrationId: number,
    public readonly changedById: number | null,
    public readonly changeType: MeterCalibrationChange,
    public readonly oldValues: Record<string, unknown>,
    public readonly newValues: Record<string, unknown>,
  ) {}
}
