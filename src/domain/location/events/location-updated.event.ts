import type { LocationChange } from '../../../core/enums/location-change.enum';

export class LocationUpdatedEvent {
  constructor(
    public readonly locationId: number,
    public readonly changedById: number | null,
    public readonly action: LocationChange,
    public readonly oldValues: Record<string, unknown>,
    public readonly newValues: Record<string, unknown>,
  ) {}
}
