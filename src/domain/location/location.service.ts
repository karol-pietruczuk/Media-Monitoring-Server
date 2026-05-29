import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Location } from './entities/location.entity';
import { LocationUpdatedEvent } from './events/location-updated.event';
import { LocationChange } from '../../core/enums/location-change.enum';
import { FindAllLocationDto } from './dto/find-all-location.dto';
import { CreateLocationDto } from './dto/create-location.dto';

interface IDatabaseError extends Error {
  code?: string;
  number?: number;
}

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    dto: CreateLocationDto & { id?: number }, // Przyjmuje całe DTO + opcjonalne ID z backupu
    changedById: number | null,
  ): Promise<Location> {
    let saved: Location;

    if (dto.id !== undefined) {
      // Ścieżka dla modułu backupu (z jawnym ID dla MS SQL)
      saved = await this.locationRepository.manager.transaction(async (tm) => {
        const metadata = tm.getRepository(Location).metadata;
        const tableName = `"${metadata.schema || 'dbo'}"."${metadata.tableName}"`;

        await tm.query(`SET IDENTITY_INSERT ${tableName} ON`);

        const location = tm.create(Location, {
          id: dto.id,
          mainLocation: dto.mainLocation,
          subLocation: dto.subLocation,
        });

        const savedEntity = await tm.save(Location, location);
        await tm.query(`SET IDENTITY_INSERT ${tableName} OFF`);
        return savedEntity;
      });
    } else {
      // Standardowa ścieżka aplikacji
      const location = this.locationRepository.create({
        mainLocation: dto.mainLocation,
        subLocation: dto.subLocation,
      });
      saved = await this.locationRepository.save(location);
    }

    // Emisja eventu do logu audytowego
    this.eventEmitter.emit(
      'location.updated',
      new LocationUpdatedEvent(
        saved.id,
        changedById,
        LocationChange.CreatedLocation,
        {},
        { mainLocation: dto.mainLocation, subLocation: dto.subLocation },
      ),
    );

    return saved;
  }

  async findAll(dto: FindAllLocationDto): Promise<Location[]> {
    const { page = 1, limit = 20, search, sortBy = 'createdAt' } = dto;
    const skip = (page - 1) * limit;

    const whereCondition = search
      ? [
          { mainLocation: ILike(`%${search}%`) },
          { subLocation: ILike(`%${search}%`) },
        ]
      : {};

    const order: Record<string, 'ASC' | 'DESC'> = { [sortBy]: 'ASC' };

    return this.locationRepository.find({
      where: whereCondition,
      order,
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
    mainLocation: string | undefined,
    subLocation: string | null | undefined,
    changedById: number,
  ): Promise<Location> {
    const location = await this.findById(id);
    const oldValues = {
      mainLocation: location.mainLocation,
      subLocation: location.subLocation,
    };

    let hasChanges = false;
    if (mainLocation !== undefined && mainLocation !== location.mainLocation) {
      location.mainLocation = mainLocation;
      hasChanges = true;
    }
    if (subLocation !== undefined && subLocation !== location.subLocation) {
      location.subLocation = subLocation;
      hasChanges = true;
    }

    if (!hasChanges) return location;

    const updatedLocation = await this.locationRepository.save(location);

    this.eventEmitter.emit(
      'location.updated',
      new LocationUpdatedEvent(
        id,
        changedById,
        LocationChange.UpdatedLocation,
        oldValues,
        {
          mainLocation: location.mainLocation,
          subLocation: location.subLocation,
        },
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

    try {
      await this.locationRepository.remove(location);
    } catch (error: unknown) {
      if (this.isForeignKeyConstraintError(error)) {
        throw new ConflictException(
          'Nie można usunąć lokalizacji, ponieważ są do niej przypisane liczniki.',
        );
      }
      throw error;
    }

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

  private isForeignKeyConstraintError(error: unknown): boolean {
    const dbError = error as IDatabaseError;
    const isMssqlConstraint =
      dbError.code === 'EREQUEST' || dbError.number === 547;
    const hasForeignKeyMessage =
      error instanceof Error && error.message.includes('FOREIGN KEY');

    return !!(isMssqlConstraint || hasForeignKeyMessage);
  }
}
