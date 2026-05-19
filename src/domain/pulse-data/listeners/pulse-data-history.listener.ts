import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PulseDataChannelHistory } from '../entities/pulse-data-channel-history.entity';
import { PulseChannelUpdatedEvent } from '../events/pulse-channel-updated.event';

@Injectable()
export class PulseDataHistoryListener {
  constructor(
    @InjectRepository(PulseDataChannelHistory)
    private readonly historyRepository: Repository<PulseDataChannelHistory>,
  ) {}

  @OnEvent('pulse-channel.updated', { async: true })
  async handleChannelUpdated(event: PulseChannelUpdatedEvent): Promise<void> {
    const history = this.historyRepository.create({
      pulseDataChannelId: event.channelId,
      changedById: event.changedById,
      pulseDataChannelChange: event.changeType,
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
