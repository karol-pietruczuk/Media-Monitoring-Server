import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSourceHistory } from '../entities/data-source-history.entity';
import { DataSourceUpdatedEvent } from '../events/data-source-updated.event';

@Injectable()
export class DataSourceHistoryListener {
  constructor(
    @InjectRepository(DataSourceHistory)
    private readonly historyRepository: Repository<DataSourceHistory>,
  ) {}

  @OnEvent('data-source.updated', { async: true })
  async handleDataSourceUpdated(event: DataSourceUpdatedEvent): Promise<void> {
    const history = this.historyRepository.create({
      dataSourceId: event.dataSourceId,
      changedById: event.changedById,
      dataSourceChange: event.changeType,
      oldValues:
        Object.keys(event.oldValues).length > 0
          ? JSON.stringify(event.oldValues)
          : null,
      newValues:
        Object.keys(event.newValues).length > 0
          ? JSON.stringify(event.newValues)
          : null,
    });

    await this.historyRepository.save(history);
  }
}
