import type { MeterChange } from '../../../core/enums/meter-change.enum';

export class MeterUpdatedEvent {
  constructor(
    public readonly meterId: number,
    public readonly changedById: number | null,
    public readonly changeType: MeterChange,
    public readonly oldValues: Record<string, unknown>,
    public readonly newValues: Record<string, unknown>,
  ) {}
}
