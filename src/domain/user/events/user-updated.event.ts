import { UserChange } from '../../../core/enums/user-change.enum';

export class UserUpdatedEvent {
  constructor(
    public readonly userId: number,
    public readonly changedById: number | null,
    public readonly action: UserChange,
    public readonly oldValues: Record<string, unknown>,
    public readonly newValues: Record<string, unknown>,
  ) {}
}
