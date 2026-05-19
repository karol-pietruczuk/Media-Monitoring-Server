import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Location } from './entities/location.entity';
import { LocationUpdatedEvent } from './events/location-updated.event';
import { LocationChange } from '../../core/enums/location-change.enum';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    mainLocation: string,
    subLocation: string | null,
    changedById: number | null,
  ): Promise<Location> {
    const location = this.locationRepository.create({
      mainLocation,
      subLocation,
    });

    const savedLocation = await this.locationRepository.save(location);

    // Emitujemy zdarzenie utworzenia nowej lokalizacji
    this.eventEmitter.emit(
      'location.updated',
      new LocationUpdatedEvent(
        savedLocation.id,
        changedById,
        LocationChange.CreatedLocation,
        {},
        { mainLocation, subLocation },
      ),
    );

    return savedLocation;
  }

  async findAll(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  async findById(id: number): Promise<Location> {
    const location = await this.locationRepository.findOne({ where: { id } });
    if (!location) {
      throw new NotFoundException(
        `Lokalizacja o ID ${id} nie została znaleziona.`,
      );
    }
    return location;
  }

  async update(
    id: number,
    mainLocation: string,
    subLocation: string | null,
    changedById: number,
  ): Promise<Location> {
    const location = await this.findById(id);

    const oldValues = {
      mainLocation: location.mainLocation,
      subLocation: location.subLocation,
    };

    const newValues = {
      mainLocation,
      subLocation,
    };

    // Jeśli nic się nie zmieniło, pomijamy zapis i generowanie logu historii
    if (
      oldValues.mainLocation === newValues.mainLocation &&
      oldValues.subLocation === newValues.subLocation
    ) {
      return location;
    }

    location.mainLocation = mainLocation;
    location.subLocation = subLocation;

    const updatedLocation = await this.locationRepository.save(location);

    // Emitujemy zdarzenie edycji lokalizacji
    this.eventEmitter.emit(
      'location.updated',
      new LocationUpdatedEvent(
        id,
        changedById,
        LocationChange.UpdatedLocation,
        oldValues,
        newValues,
      ),
    );

    return updatedLocation;
  }

  async remove(id: number, changedById: number): Promise<void> {
    const location = await this.findById(id);

    const oldValues = {
      mainLocation: location.mainLocation,
      subLocation: location.subLocation,
    };

    // Twarde usunięcie z bazy danych MSSQL
    await this.locationRepository.remove(location);

    // Emitujemy zdarzenie usunięcia lokalizacji (w bazie historycznej zostanie ślad)
    this.eventEmitter.emit(
      'location.updated',
      new LocationUpdatedEvent(
        id,
        changedById,
        LocationChange.DeletedLocation,
        oldValues,
        {},
      ),
    );
  }
}
