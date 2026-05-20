import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationHistory } from '../entities/location-history.entity';
import { LocationUpdatedEvent } from '../events/location-updated.event';

@Injectable()
export class LocationHistoryListener {
  constructor(
    @InjectRepository(LocationHistory)
    private readonly historyRepository: Repository<LocationHistory>,
  ) {}

  @OnEvent('location.updated') // Zmieniono na synchroniczne dla spójności
  async handleLocationUpdatedEvent(event: LocationUpdatedEvent): Promise<void> {
    const history = this.historyRepository.create({
      locationId: event.locationId,
      changedById: event.changedById ?? null,
      action: event.action,
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
