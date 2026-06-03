import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'; // <-- Dodano ConflictException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm'; // <-- Dodano IsNull
import { EventEmitter2 } from '@nestjs/event-emitter';

import { PulseDataChannel } from './entities/pulse-data-channel.entity';
import { PulseDataMultiplier } from './entities/pulse-data-multiplier.entity';

import { CreatePulseChannelDto } from './dto/create-pulse-channel.dto';
import { UpdatePulseChannelDto } from './dto/update-pulse-channel.dto';
import { CreateMultiplierDto } from './dto/create-pulse-multiplier.dto';
import { UpdateMultiplierDto } from './dto/update-pulse-multiplier.dto';

import { PulseChannelUpdatedEvent } from './events/pulse-channel-updated.event';
// Załóżmy analogiczną nazwę dla eventu mnożnika, dostosuj jeśli Twoja klasa nazywa się inaczej:
import { PulseMultiplierUpdatedEvent } from './events/pulse-multiplier-updated.event';

import { Meter } from '../meter/entities/meter.entity';
import { DataSource } from '../data-source/entities/data-source.entity';

import { PulseDataChannelChange } from '../../core/enums/pulse-data-channel-change.enum';
// Załóżmy analogiczny enum, dostosuj nazwę jeśli jest inna:
import { PulseDataMultiplierChange } from '../../core/enums/pulse-data-multiplier-change.enum';

@Injectable()
export class PulseDataService {
  constructor(
    @InjectRepository(PulseDataChannel)
    private readonly channelRepository: Repository<PulseDataChannel>,
    @InjectRepository(PulseDataMultiplier)
    private readonly multiplierRepository: Repository<PulseDataMultiplier>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // =========================================================================
  // LOGIKA DLA KANAŁÓW IMPULSOWYCH (PULSE DATA CHANNEL)
  // =========================================================================

  async createChannel(
    dto: CreatePulseChannelDto & { id?: number },
    changedById: number | null,
  ): Promise<PulseDataChannel> {
    const mappingInfoString = JSON.stringify(dto.dataMappingInfo);

    if (dto.id !== undefined) {
      // Zapis z jawnym ID (np. z modułu backupu)
      const savedChannel = await this.channelRepository.manager.transaction(
        async (tm): Promise<PulseDataChannel> => {
          const metadata = tm.getRepository(PulseDataChannel).metadata;
          const tableName = `"${metadata.schema || 'dbo'}"."${metadata.tableName}"`;

          await tm.query(`SET IDENTITY_INSERT ${tableName} ON`);

          const channel = tm.create(PulseDataChannel, {
            id: dto.id,
            meter: { id: dto.meterId } as Meter,
            dataSource: { id: dto.dataSourceId } as DataSource,
            dataMappingInfo: mappingInfoString,
          });

          const savedEntity = await tm.save(PulseDataChannel, channel);

          await tm.query(`SET IDENTITY_INSERT ${tableName} OFF`);

          return savedEntity;
        },
      );

      // Emitujemy zdarzenie po pomyślnym zatwierdzeniu transakcji
      this.eventEmitter.emit(
        'pulse-channel.updated',
        new PulseChannelUpdatedEvent(
          savedChannel.id,
          changedById,
          PulseDataChannelChange.CreatedPulseDataChannel,
          {},
          {
            dataSourceId: dto.dataSourceId,
            dataMappingInfo: dto.dataMappingInfo,
          },
        ),
      );

      return savedChannel;
    } else {
      // Standardowa ścieżka zapisu (baza danych sama nadaje ID)
      const channel = this.channelRepository.create({
        meter: { id: dto.meterId } as Meter,
        dataSource: { id: dto.dataSourceId } as DataSource,
        dataMappingInfo: mappingInfoString,
      });

      const savedChannel = await this.channelRepository.save(channel);

      this.eventEmitter.emit(
        'pulse-channel.updated',
        new PulseChannelUpdatedEvent(
          savedChannel.id,
          changedById,
          PulseDataChannelChange.CreatedPulseDataChannel,
          {},
          {
            dataSourceId: dto.dataSourceId,
            dataMappingInfo: dto.dataMappingInfo,
          },
        ),
      );

      return savedChannel;
    }
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

  async createMultiplier(
    dto: CreateMultiplierDto,
    changedById: number | null,
  ): Promise<PulseDataMultiplier> {
    let saved: PulseDataMultiplier;
    const newFromDate = new Date(dto.expirationDateFrom);

    await this.multiplierRepository.manager.transaction(async (tm) => {
      // 1. Sprawdzamy czy istnieje otwarty (aktualny) mnożnik dla tego licznika za pomocą IsNull()
      const activeMultiplier = await tm.findOne(PulseDataMultiplier, {
        where: {
          meter: { id: dto.meterId },
          expirationDateUntil: IsNull(), // <-- Bezpieczne i bez "as any"
        },
      });

      if (activeMultiplier) {
        // Jeśli nowa data "od" jest starsza lub równa dacie "od" obecnego mnożnika -> BŁĄD
        if (
          newFromDate.getTime() <= activeMultiplier.expirationDateFrom.getTime()
        ) {
          throw new ConflictException(
            `Nakładające się daty. Nowy mnożnik musi obowiązywać od daty późniejszej niż ${activeMultiplier.expirationDateFrom.toISOString()}`,
          );
        }

        // Automatyczne "zamknięcie" poprzedniego okresu
        activeMultiplier.expirationDateUntil = newFromDate;
        await tm.save(PulseDataMultiplier, activeMultiplier);
      }

      // 2. Obsługa manualnego wprowadzania z ID (dla modułu backupu)
      if (dto.id !== undefined) {
        const metadata = tm.getRepository(PulseDataMultiplier).metadata;
        const tableName = `"${metadata.schema || 'dbo'}"."${metadata.tableName}"`;
        await tm.query(`SET IDENTITY_INSERT ${tableName} ON`);

        const multiplier = tm.create(PulseDataMultiplier, {
          id: dto.id,
          value: dto.value,
          expirationDateFrom: newFromDate,
          meter: { id: dto.meterId } as Meter,
        });

        saved = await tm.save(PulseDataMultiplier, multiplier);
        await tm.query(`SET IDENTITY_INSERT ${tableName} OFF`);
      } else {
        // 3. Standardowe tworzenie mnożnika
        const multiplier = tm.create(PulseDataMultiplier, {
          value: dto.value,
          expirationDateFrom: newFromDate,
          meter: { id: dto.meterId } as Meter,
        });
        saved = await tm.save(PulseDataMultiplier, multiplier);
      }
    });

    this.eventEmitter.emit(
      'pulse-multiplier.updated',
      new PulseMultiplierUpdatedEvent(
        saved!.id,
        changedById,
        PulseDataMultiplierChange.CreatedPulseDataMultiplier,
        {},
        {
          value: dto.value,
          expirationDateFrom: dto.expirationDateFrom,
          meterId: dto.meterId,
        },
      ),
    );

    return saved!;
  }

  async findAllMultipliers(): Promise<PulseDataMultiplier[]> {
    return this.multiplierRepository.find({
      relations: ['meter'],
    });
  }

  async findMultiplierById(id: number): Promise<PulseDataMultiplier> {
    const multiplier = await this.multiplierRepository.findOne({
      where: { id },
      relations: ['meter'],
    });

    if (!multiplier) {
      throw new NotFoundException(`Mnożnik impulsów o ID ${id} nie istnieje.`);
    }
    return multiplier;
  }

  async updateMultiplier(
    id: number,
    dto: UpdateMultiplierDto,
    changedById: number,
  ): Promise<PulseDataMultiplier> {
    const multiplier = await this.findMultiplierById(id);

    const oldValues = {
      value: multiplier.value,
      expirationDateFrom: multiplier.expirationDateFrom.toISOString(),
    };

    if (dto.value !== undefined) {
      multiplier.value = dto.value;
    }
    if (dto.expirationDateFrom !== undefined) {
      multiplier.expirationDateFrom = new Date(dto.expirationDateFrom);
    }

    const updated = await this.multiplierRepository.save(multiplier);

    this.eventEmitter.emit(
      'pulse-multiplier.updated',
      new PulseMultiplierUpdatedEvent(
        id,
        changedById,
        PulseDataMultiplierChange.UpdatedPulseDataMultiplier,
        oldValues,
        {
          value: dto.value ?? oldValues.value,
          expirationDateFrom:
            dto.expirationDateFrom ?? oldValues.expirationDateFrom,
        },
      ),
    );

    return updated;
  }

  async removeMultiplier(id: number, changedById: number): Promise<void> {
    const multiplier = await this.findMultiplierById(id);

    const oldValues = {
      value: multiplier.value,
      expirationDateFrom: multiplier.expirationDateFrom.toISOString(),
      meterId: multiplier.meter?.id ?? null,
    };

    await this.multiplierRepository.remove(multiplier);

    this.eventEmitter.emit(
      'pulse-multiplier.updated',
      new PulseMultiplierUpdatedEvent(
        id,
        changedById,
        PulseDataMultiplierChange.DeletedPulseDataMultiplier,
        oldValues,
        {},
      ),
    );
  }
}
