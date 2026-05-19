import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TotalDataChannelHistory } from '../entities/total-data-channel-history.entity';
import { TotalChannelUpdatedEvent } from '../events/total-channel-updated.event';

@Injectable()
export class TotalDataHistoryListener {
  constructor(
    @InjectRepository(TotalDataChannelHistory)
    private readonly historyRepository: Repository<TotalDataChannelHistory>,
  ) {}

  @OnEvent('total-channel.updated', { async: true })
  async handleChannelUpdated(event: TotalChannelUpdatedEvent): Promise<void> {
    const history = this.historyRepository.create({
      totalDataChannelId: event.channelId,
      changedById: event.changedById,
      totalDataChannelChangeType: event.changeType,
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
