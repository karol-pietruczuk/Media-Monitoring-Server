import type { PulseDataChannelChange } from '../../../core/enums/pulse-data-channel-change.enum';

export class PulseChannelUpdatedEvent {
  constructor(
    public readonly channelId: number,
    public readonly changedById: number | null,
    public readonly changeType: PulseDataChannelChange,
    public readonly oldValues: Record<string, unknown>,
    public readonly newValues: Record<string, unknown>,
  ) {}
}
