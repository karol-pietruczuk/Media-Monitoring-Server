import { UserChange } from '../../../core/enum/user-change.enum';

export class UserUpdatedEvent {
  constructor(
    public readonly userId: number,
    public readonly changedById: number | null,
    public readonly action: UserChange,
    public readonly oldValues: Record<string, any>,
    public readonly newValues: Record<string, any>,
  ) {}
}
