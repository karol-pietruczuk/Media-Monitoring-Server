import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter'; // Czysty import
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

  @OnEvent('user.updated', { async: true })
  async handleUserUpdatedEvent(event: UserUpdatedEvent) {
    const history = this.historyRepository.create({
      userId: event.userId,
      changedById: event.changedById ?? null,
      action: event.action,
      oldValues: JSON.stringify(event.oldValues),
      newValues: JSON.stringify(event.newValues),
    });

    await this.historyRepository.save(history);
  }
}
