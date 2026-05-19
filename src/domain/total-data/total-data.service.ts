import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; // Importujemy TYLKO Repository
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TotalDataChannel } from './entities/total-data-channel.entity';
import { CreateTotalChannelDto } from './dto/create-total-channel.dto';
import { UpdateTotalChannelDto } from './dto/update-total-channel.dto';
import { TotalChannelUpdatedEvent } from './events/total-channel-updated.event';
import { Meter } from '../meter/entities/meter.entity';
import { DataSource } from '../data-source/entities/data-source.entity'; // KLUCZOWY POPRAWNY IMPORT TWOJEJ ENCJI
import { TotalDataChannelChange } from '../../core/enums/total-data-channel-change.enum';

@Injectable()
export class TotalDataService {
  constructor(
    @InjectRepository(TotalDataChannel)
    private readonly channelRepository: Repository<TotalDataChannel>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createChannel(
    dto: CreateTotalChannelDto,
    changedById: number | null,
  ): Promise<TotalDataChannel> {
    const mappingInfoString = JSON.stringify(dto.dataMappingInfo);

    // Po poprawie importu, asercja typu 'as DataSource' przechodzi bezbłędnie
    const channel = this.channelRepository.create({
      meter: { id: dto.meterId } as Meter,
      dataSource: { id: dto.dataSourceId } as DataSource,
      dataMappingInfo: mappingInfoString,
    });

    const saved = await this.channelRepository.save(channel);

    this.eventEmitter.emit(
      'total-channel.updated',
      new TotalChannelUpdatedEvent(
        saved.id,
        changedById,
        TotalDataChannelChange.CreatedTotalDataChannel,
        {},
        {
          dataSourceId: dto.dataSourceId,
          dataMappingInfo: dto.dataMappingInfo,
        },
      ),
    );

    return saved;
  }

  async findChannelById(id: number): Promise<TotalDataChannel> {
    // Upewniamy się, że wywołujemy findOne z poprawnym obiektem konfiguracyjnym 'where'
    const channel = await this.channelRepository.findOne({
      where: { id },
      relations: ['dataSource', 'meter'],
    });

    if (!channel) {
      throw new NotFoundException(
        `Kanał danych całkowitych o ID ${id} nie istnieje.`,
      );
    }
    return channel;
  }

  async updateChannel(
    id: number,
    dto: UpdateTotalChannelDto,
    changedById: number,
  ): Promise<TotalDataChannel> {
    const channel = await this.findChannelById(id);

    const oldValues = {
      dataSourceId: channel.dataSource.id,
      dataMappingInfo: JSON.parse(channel.dataMappingInfo) as Record<
        string,
        unknown
      >,
    };

    if (dto.dataSourceId) {
      channel.dataSource = { id: dto.dataSourceId } as DataSource;
    }
    if (dto.dataMappingInfo) {
      channel.dataMappingInfo = JSON.stringify(dto.dataMappingInfo);
    }

    const updated = await this.channelRepository.save(channel);

    this.eventEmitter.emit(
      'total-channel.updated',
      new TotalChannelUpdatedEvent(
        id,
        changedById,
        TotalDataChannelChange.UpdatedTotalDataChannel,
        oldValues,
        {
          dataSourceId: dto.dataSourceId ?? oldValues.dataSourceId,
          dataMappingInfo: dto.dataMappingInfo ?? oldValues.dataMappingInfo,
        },
      ),
    );

    return updated;
  }

  async removeChannel(id: number, changedById: number): Promise<void> {
    const channel = await this.findChannelById(id);

    const oldValues = {
      meterId: channel.meter.id,
      dataSourceId: channel.dataSource.id,
      dataMappingInfo: JSON.parse(channel.dataMappingInfo) as Record<
        string,
        unknown
      >,
    };

    await this.channelRepository.remove(channel);

    this.eventEmitter.emit(
      'total-channel.updated',
      new TotalChannelUpdatedEvent(
        id,
        changedById,
        TotalDataChannelChange.DeletedTotalDataChannel,
        oldValues,
        {},
      ),
    );
  }
}
