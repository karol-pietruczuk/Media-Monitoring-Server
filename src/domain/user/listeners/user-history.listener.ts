import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserHistory } from '../entities/user-history.entity';
import { UserUpdatedEvent } from '../events/user-updated.event';

@Injectable()
export class UserHistoryListener {
  constructor(
    @InjectRepository(UserHistory)
    private readonly historyRepository: Repository<UserHistory>,
  ) {}

  @OnEvent('user.updated')
  async handleUserUpdated(event: UserUpdatedEvent): Promise<void> {
    const history = this.historyRepository.create({
      userId: event.userId,
      changedById: event.changedById ?? null,
      action: event.action,

      // Zamiast null, wysyłamy pusty string lub pusty obiekt JSON
      oldValues:
        event.oldValues && Object.keys(event.oldValues).length > 0
          ? JSON.stringify(event.oldValues)
          : '{}', // Pusty obiekt JSON jako string

      newValues:
        event.newValues && Object.keys(event.newValues).length > 0
          ? JSON.stringify(event.newValues)
          : '{}', // Pusty obiekt JSON jako string
    });

    await this.historyRepository.save(history);
  }
}
