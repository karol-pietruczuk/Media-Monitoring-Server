import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DataSource } from './entities/data-source.entity';
import { CreateDataSourceDto } from './dto/create-data-source.dto';
import { UpdateDataSourceDto } from './dto/update-data-source.dto';
import { DataSourceUpdatedEvent } from './events/data-source-updated.event';
import { DataSourceChange } from '../../core/enums/data-source-change.enum';

@Injectable()
export class DataSourceService {
  constructor(
    @InjectRepository(DataSource)
    private readonly dataSourceRepository: Repository<DataSource>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    dto: CreateDataSourceDto,
    changedById: number | null,
  ): Promise<DataSource> {
    const connectionInfoString = JSON.stringify(dto.connectionInfo);
    const dataSource = this.dataSourceRepository.create({
      protocol: dto.protocol,
      connectionInfo: connectionInfoString,
    });
    const saved = await this.dataSourceRepository.save(dataSource);

    this.eventEmitter.emit(
      'data-source.updated',
      new DataSourceUpdatedEvent(
        saved.id,
        changedById,
        DataSourceChange.CreatedDataSource,
        {},
        { protocol: dto.protocol, connectionInfo: dto.connectionInfo },
      ),
    );
    return saved;
  }

  async findAll(): Promise<DataSource[]> {
    return this.dataSourceRepository.find();
  }

  async findById(id: number): Promise<DataSource> {
    const dataSource = await this.dataSourceRepository.findOne({
      where: { id },
    });
    if (!dataSource) {
      throw new NotFoundException(`Źródło danych o ID ${id} nie istnieje.`);
    }
    return dataSource;
  }

  async update(
    id: number,
    dto: UpdateDataSourceDto,
    changedById: number,
  ): Promise<DataSource> {
    const dataSource = await this.findById(id);
    const oldValues = {
      protocol: dataSource.protocol,
      connectionInfo: JSON.parse(dataSource.connectionInfo) as Record<
        string,
        unknown
      >,
    };
    let hasChanges = false;

    if (dto.protocol !== undefined && dataSource.protocol !== dto.protocol) {
      dataSource.protocol = dto.protocol;
      hasChanges = true;
    }

    if (dto.connectionInfo !== undefined) {
      const currentConnectionInfo = JSON.parse(
        dataSource.connectionInfo,
      ) as Record<string, unknown>;

      // Bezpieczne, głębokie porównanie struktur obiektów zamiast podatnego na kolejność kluczy stringu
      if (!this.deepEqual(currentConnectionInfo, dto.connectionInfo)) {
        dataSource.connectionInfo = JSON.stringify(dto.connectionInfo);
        hasChanges = true;
      }
    }

    if (!hasChanges) {
      return dataSource;
    }

    const updated = await this.dataSourceRepository.save(dataSource);

    this.eventEmitter.emit(
      'data-source.updated',
      new DataSourceUpdatedEvent(
        id,
        changedById,
        DataSourceChange.UpdatedDataSource,
        oldValues,
        {
          protocol: dto.protocol || dataSource.protocol,
          connectionInfo:
            dto.connectionInfo ||
            (JSON.parse(dataSource.connectionInfo) as Record<string, unknown>),
        },
      ),
    );

    return updated;
  }

  async deactivate(id: number, changedById: number): Promise<DataSource> {
    const dataSource = await this.findById(id);
    if (!dataSource.isActive) {
      return dataSource;
      // Już jest wyłączone, nic nie robimy
    }

    dataSource.isActive = false;
    const updated = await this.dataSourceRepository.save(dataSource);

    this.eventEmitter.emit(
      'data-source.updated',
      new DataSourceUpdatedEvent(
        id,
        changedById,
        DataSourceChange.DeactivatedDataSource,
        { isActive: true },
        { isActive: false },
      ),
    );
    return updated;
  }

  async activate(id: number, changedById: number): Promise<DataSource> {
    const dataSource = await this.findById(id);
    if (dataSource.isActive) {
      return dataSource;
      // Jest już aktywne, nic nie robimy
    }

    dataSource.isActive = true;
    const updated = await this.dataSourceRepository.save(dataSource);

    this.eventEmitter.emit(
      'data-source.updated',
      new DataSourceUpdatedEvent(
        id,
        changedById,
        DataSourceChange.ActivatedDataSource,
        { isActive: false },
        { isActive: true },
      ),
    );
    return updated;
  }

  async remove(id: number, changedById: number): Promise<void> {
    const dataSource = await this.findById(id);
    const oldValues = {
      protocol: dataSource.protocol,
      connectionInfo: JSON.parse(dataSource.connectionInfo) as Record<
        string,
        unknown
      >,
      isActive: dataSource.isActive,
    };

    try {
      // TWARDE USUNIĘCIE: Próba skasowania rekordu z bazy
      await this.dataSourceRepository.remove(dataSource);
    } catch (error: unknown) {
      // POPRAWKA LINTERA: Sprawdzamy czy to obiekt błędu
      if (error instanceof Error) {
        if (error.message.includes('FOREIGN KEY')) {
          throw new ConflictException(
            'Nie można usunąć źródła danych, ponieważ istnieją przypisane do niego liczniki lub kanały danych.',
          );
        }

        // Dodatkowe, bezpieczne rzutowanie pod kod błędu MSSQL
        const sqlError = error as Error & { code?: string };
        if (sqlError.code === 'EREQUEST') {
          throw new ConflictException(
            'Nie można usunąć źródła danych, ponieważ istnieją przypisane do niego liczniki lub kanały danych.',
          );
        }
      }

      throw error;
    }

    // Ślad audytowy w historii zostanie zapisany tylko, jeśli usunięcie z bazy się powiodło
    this.eventEmitter.emit(
      'data-source.updated',
      new DataSourceUpdatedEvent(
        id,
        changedById,
        DataSourceChange.DeletedDataSource,
        oldValues,
        {},
      ),
    );
  }

  /**
   * Helper służący do głębokiego porównywania obiektów konfiguracyjnych (connectionInfo)
   */
  private deepEqual(obj1: unknown, obj2: unknown): boolean {
    if (obj1 === obj2) return true;

    if (
      typeof obj1 !== 'object' ||
      obj1 === null ||
      typeof obj2 !== 'object' ||
      obj2 === null
    ) {
      return false;
    }

    // POPRAWKA LINTERA: Rzutujemy sprawdzone obiekty na Record, by bezpiecznie iterować po kluczach
    const record1 = obj1 as Record<string, unknown>;
    const record2 = obj2 as Record<string, unknown>;

    const keys1 = Object.keys(record1);
    const keys2 = Object.keys(record2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (!keys2.includes(key) || !this.deepEqual(record1[key], record2[key])) {
        return false;
      }
    }

    return true;
  }
}
