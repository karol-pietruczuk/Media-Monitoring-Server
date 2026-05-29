import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TotalDataChannel } from './entities/total-data-channel.entity';
import { CreateTotalChannelDto } from './dto/create-total-channel.dto';
import { UpdateTotalChannelDto } from './dto/update-total-channel.dto';
import { TotalChannelUpdatedEvent } from './events/total-channel-updated.event';
import { Meter } from '../meter/entities/meter.entity';
import { DataSource } from '../data-source/entities/data-source.entity';
import { TotalDataChannelChange } from '../../core/enums/total-data-channel-change.enum';

@Injectable()
export class TotalDataService {
  constructor(
    @InjectRepository(TotalDataChannel)
    private readonly channelRepository: Repository<TotalDataChannel>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Tworzy kanał danych całkowitych.
   * Wspiera opcjonalne przekazywanie "id" (np. z modułu backupu) za pomocą IDENTITY_INSERT w MS SQL.
   */
  async createChannel(
    dto: CreateTotalChannelDto & { id?: number }, // Rozszerzamy typ o opcjonalne id z backupu
    changedById: number | null,
  ): Promise<TotalDataChannel> {
    const mappingInfoString = JSON.stringify(dto.dataMappingInfo);
    let saved: TotalDataChannel;

    // Jeżeli przekazano id, musimy otworzyć transakcję i włączyć IDENTITY_INSERT
    if (dto.id !== undefined) {
      await this.channelRepository.manager.transaction(async (tm) => {
        const metadata = tm.getRepository(TotalDataChannel).metadata;
        const tableName = `"${metadata.schema || 'dbo'}"."${metadata.tableName}"`;

        // Włączamy wymuszenie własnego ID w bazie MS SQL
        await tm.query(`SET IDENTITY_INSERT ${tableName} ON`);

        const channel = tm.create(TotalDataChannel, {
          id: dto.id, // Przekazujemy podane ID
          meter: { id: dto.meterId } as Meter,
          dataSource: { id: dto.dataSourceId } as DataSource,
          dataMappingInfo: mappingInfoString,
        });

        saved = await tm.save(TotalDataChannel, channel);

        // Wyłączamy wymuszenie
        await tm.query(`SET IDENTITY_INSERT ${tableName} OFF`);
      });
    } else {
      // Standardowa ścieżka bez podanego ID - baza sama inkrementuje klucz
      const channel = this.channelRepository.create({
        meter: { id: dto.meterId } as Meter,
        dataSource: { id: dto.dataSourceId } as DataSource,
        dataMappingInfo: mappingInfoString,
      });

      saved = await this.channelRepository.save(channel);
    }

    // POZA TRANSAKCJĄ (Po COMMIT): Bezpiecznie emitujemy event dla historii zmian
    this.eventEmitter.emit(
      'total-channel.updated',
      new TotalChannelUpdatedEvent(
        saved!.id,
        changedById,
        TotalDataChannelChange.CreatedTotalDataChannel,
        {},
        {
          dataSourceId: dto.dataSourceId,
          dataMappingInfo: dto.dataMappingInfo,
        },
      ),
    );

    return saved!;
  }

  async findChannelById(id: number): Promise<TotalDataChannel> {
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
