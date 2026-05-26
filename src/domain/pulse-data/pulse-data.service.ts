import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PulseDataChannel } from './entities/pulse-data-channel.entity';
import { CreatePulseChannelDto } from './dto/create-pulse-channel.dto';
import { UpdatePulseChannelDto } from './dto/update-pulse-channel.dto';
import { PulseChannelUpdatedEvent } from './events/pulse-channel-updated.event';
import { Meter } from '../meter/entities/meter.entity';
import { DataSource } from '../data-source/entities/data-source.entity';
import { PulseDataChannelChange } from '../../core/enums/pulse-data-channel-change.enum';

@Injectable()
export class PulseDataService {
  constructor(
    @InjectRepository(PulseDataChannel)
    private readonly channelRepository: Repository<PulseDataChannel>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createChannel(
    dto: CreatePulseChannelDto,
    changedById: number | null,
  ): Promise<PulseDataChannel> {
    const mappingInfoString = JSON.stringify(dto.dataMappingInfo);

    const channel = this.channelRepository.create({
      meter: { id: dto.meterId } as Meter,
      dataSource: { id: dto.dataSourceId } as DataSource,
      dataMappingInfo: mappingInfoString,
    });

    const saved = await this.channelRepository.save(channel);

    this.eventEmitter.emit(
      'pulse-channel.updated',
      new PulseChannelUpdatedEvent(
        saved.id,
        changedById,
        PulseDataChannelChange.CreatedPulseDataChannel,
        {},
        {
          dataSourceId: dto.dataSourceId,
          dataMappingInfo: dto.dataMappingInfo,
        },
      ),
    );

    return saved;
  }

  async findChannelById(id: number): Promise<PulseDataChannel> {
    const channel = await this.channelRepository.findOne({
      where: { id },
      relations: ['dataSource', 'meter'],
    });

    if (!channel) {
      throw new NotFoundException(`Kanał impulsowy o ID ${id} nie istnieje.`);
    }
    return channel;
  }

  async updateChannel(
    id: number,
    dto: UpdatePulseChannelDto,
    changedById: number,
  ): Promise<PulseDataChannel> {
    const channel = await this.findChannelById(id);

    // BEZPIECZNE AUDIO: Optional chaining zapobiega wywaleniu błędu aplikacji
    const oldValues = {
      dataSourceId: channel.dataSource?.id ?? null,
      dataMappingInfo: channel.dataMappingInfo
        ? (JSON.parse(channel.dataMappingInfo) as Record<string, unknown>)
        : {},
    };

    if (dto.dataSourceId) {
      channel.dataSource = { id: dto.dataSourceId } as DataSource;
    }
    if (dto.dataMappingInfo) {
      channel.dataMappingInfo = JSON.stringify(dto.dataMappingInfo);
    }

    const updated = await this.channelRepository.save(channel);

    this.eventEmitter.emit(
      'pulse-channel.updated',
      new PulseChannelUpdatedEvent(
        id,
        changedById,
        PulseDataChannelChange.UpdatedPulseDataChannel,
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

    // BEZPIECZNE AUDIO: Zabezpieczenie przed usunięciem kaskadowym/pustymi relacjami
    const oldValues = {
      meterId: channel.meter?.id ?? null,
      dataSourceId: channel.dataSource?.id ?? null,
      dataMappingInfo: channel.dataMappingInfo
        ? (JSON.parse(channel.dataMappingInfo) as Record<string, unknown>)
        : {},
    };

    await this.channelRepository.remove(channel);

    this.eventEmitter.emit(
      'pulse-channel.updated',
      new PulseChannelUpdatedEvent(
        id,
        changedById,
        PulseDataChannelChange.DeletedPulseDataChannel,
        oldValues,
        {},
      ),
    );
  }
}
