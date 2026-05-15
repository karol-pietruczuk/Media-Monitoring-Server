export class UserUpdatedEvent {
  constructor(
    public readonly userId: number,
    public readonly changedById: number | null,
    public readonly action: string,
    public readonly oldValues: Record<string, any>,
    public readonly newValues: Record<string, any>,
  ) {}
}
