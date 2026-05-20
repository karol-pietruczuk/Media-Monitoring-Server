import { Injectable, NotFoundException } from '@nestjs/common';
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
      const connectionInfoString = JSON.stringify(dto.connectionInfo);
      if (dataSource.connectionInfo !== connectionInfoString) {
        dataSource.connectionInfo = connectionInfoString;
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
          connectionInfo: dto.connectionInfo || JSON.parse(dataSource.connectionInfo) as Record<string, unknown>,
        },
      ),
    );

    return updated;
  }

  async deactivate(id: number, changedById: number): Promise<DataSource> {
    const dataSource = await this.findById(id);

    if (!dataSource.isActive) {
      return dataSource; // Już jest wyłączone, nic nie robimy
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
      return dataSource; // Jest już aktywne, nic nie robimy
    }

    dataSource.isActive = true;
    const updated = await this.dataSourceRepository.save(dataSource);

    // Emitujemy zdarzenie aktywacji źródła danych
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

    // TWARDE USUNIĘCIE: Jeśli do źródła są podpięte liczniki, MSSQL bezpiecznie odrzuci transakcję.
    await this.dataSourceRepository.remove(dataSource);

    // Ślad audytowy w historii i tak zostanie zapisany na zawsze
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
}
