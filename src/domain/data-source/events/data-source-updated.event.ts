import type { DataSourceChange } from '../../../core/enums/data-source-change.enum';

export class DataSourceUpdatedEvent {
  constructor(
    public readonly dataSourceId: number,
    public readonly changedById: number | null,
    public readonly changeType: DataSourceChange,
    public readonly oldValues: Record<string, unknown>,
    public readonly newValues: Record<string, unknown>,
  ) {}
}
