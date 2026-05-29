import { PulseDataMultiplierChange } from '../../../core/enums/pulse-data-multiplier-change.enum';

export class PulseMultiplierUpdatedEvent {
  constructor(
    public readonly multiplierId: number,
    public readonly changedById: number | null,
    public readonly changeType: PulseDataMultiplierChange,
    public readonly oldValues: Record<string, unknown>,
    public readonly newValues: Record<string, unknown>,
  ) {}
}
