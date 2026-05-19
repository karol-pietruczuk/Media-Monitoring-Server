import type { TotalDataChannelChange } from '../../../core/enums/total-data-channel-change.enum';

export class TotalChannelUpdatedEvent {
  constructor(
    public readonly channelId: number,
    public readonly changedById: number | null,
    public readonly changeType: TotalDataChannelChange,
    public readonly oldValues: Record<string, unknown>,
    public readonly newValues: Record<string, unknown>,
  ) {}
}
