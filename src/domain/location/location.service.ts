import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Location } from './entities/location.entity';
import { LocationUpdatedEvent } from './events/location-updated.event';
import { LocationChange } from '../../core/enums/location-change.enum';
import { FindAllLocationDto } from './dto/find-all-location.dto';

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

  async findAll(dto: FindAllLocationDto): Promise<Location[]> {
    const { page = 1, limit = 20, search, sortBy = 'createdAt' } = dto;
    const skip = (page - 1) * limit;

    // Budujemy dynamiczny warunek WHERE dla wyszukiwania tekstowego
    const whereCondition = search
      ? [
          { mainLocation: ILike(`%${search}%`) },
          { subLocation: ILike(`%${search}%`) },
        ]
      : {};

    return this.locationRepository.find({
      where: whereCondition,
      order: { [sortBy]: 'ASC' }, // Sortowanie dynamiczne po zdefiniowanej kolumnie
      skip: skip,
      take: limit,
    });
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
    mainLocation: string | undefined, // Zmiana typu na opcjonalny string
    subLocation: string | null | undefined, // Zmiana typu na opcjonalny string/null
    changedById: number,
  ): Promise<Location> {
    const location = await this.findById(id);

    const oldValues = {
      mainLocation: location.mainLocation,
      subLocation: location.subLocation,
    };

    // Przypisujemy nową wartość tylko wtedy, gdy została jawnie przekazana w DTO
    const newValues = {
      mainLocation:
        mainLocation !== undefined ? mainLocation : location.mainLocation,
      subLocation:
        subLocation !== undefined ? subLocation : location.subLocation,
    };

    // Jeśli po analizie nic się nie zmieniło, przerywamy zapis
    if (
      oldValues.mainLocation === newValues.mainLocation &&
      oldValues.subLocation === newValues.subLocation
    ) {
      return location;
    }

    location.mainLocation = newValues.mainLocation;
    location.subLocation = newValues.subLocation;

    const updatedLocation = await this.locationRepository.save(location);

    // Emitujemy zdarzenie edycji z precyzyjnymi danymi różnicowymi
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
