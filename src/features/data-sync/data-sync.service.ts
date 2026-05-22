import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource as TypeOrmDataSource } from 'typeorm';

import { DataProviderFactory } from '../../infrastructure/data-provider-factory';
import { DataSource } from '../../domain/data-source/entities/data-source.entity';
import { PulseDataChannel } from '../../domain/pulse-data/entities/pulse-data-channel.entity';
import { TotalDataChannel } from '../../domain/total-data/entities/total-data-channel.entity';
import { PulseDataMeasurement } from '../../domain/pulse-data/entities/pulse-data-measurement.entity';
import { TotalDataMeasurement } from '../../domain/total-data/entities/total-data-measurement.entity';
import { DataSourceProtocol } from '../../core/enums/data-source-protocol.enum';
import { IOpcUaBulkMapping } from '../../infrastructure/opcua/interface/opcua-mapping.interface';
import { Meter } from '../../domain/meter/entities/meter.entity';
import { OpcUaConnectionDto } from '../../infrastructure/opcua/dto/opcua-connection.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class DataSyncService {
  private readonly logger = new Logger(DataSyncService.name);
  private isProcessing = false;

  constructor(
    private readonly providerFactory: DataProviderFactory,
    private readonly eventEmitter: EventEmitter2,
    private readonly typeOrmDataSource: TypeOrmDataSource, // Do transakcji Bulk Insert

    @InjectRepository(DataSource)
    private readonly dataSourceRepository: Repository<DataSource>,
    @InjectRepository(PulseDataChannel)
    private readonly pulseChannelRepository: Repository<PulseDataChannel>,
    @InjectRepository(TotalDataChannel)
    private readonly totalChannelRepository: Repository<TotalDataChannel>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleDataSync() {
    if (this.isProcessing) {
      this.logger.warn('Poprzednia synchronizacja nadal trwa. Pomijam cykl...');
      return;
    }

    this.isProcessing = true;
    const startTime = Date.now();
    this.logger.log('Rozpoczynam cykl synchronizacji danych...');

    try {
      const activeDataSources = await this.dataSourceRepository.find({
        where: { isActive: true },
      });

      let totalRecordsSaved = 0;

      for (const ds of activeDataSources) {
        try {
          const pulseChannels = await this.pulseChannelRepository.find({
            where: { dataSource: { id: ds.id } },
            relations: ['meter'],
          });
          const totalChannels = await this.totalChannelRepository.find({
            where: { dataSource: { id: ds.id } },
            relations: ['meter'],
          });

          if (pulseChannels.length === 0 && totalChannels.length === 0) {
            continue;
          }

          // 3. DEDUPLIKACJA MAPOWAŃ
          const uniqueMappings = new Map<string, IOpcUaBulkMapping>();
          pulseChannels.forEach((ch) =>
            uniqueMappings.set(
              ch.dataMappingInfo,
              JSON.parse(ch.dataMappingInfo) as IOpcUaBulkMapping,
            ),
          );
          totalChannels.forEach((ch) =>
            uniqueMappings.set(
              ch.dataMappingInfo,
              JSON.parse(ch.dataMappingInfo) as IOpcUaBulkMapping,
            ),
          );

          const protocolStr =
            ds.protocol === DataSourceProtocol.Opcua ? 'OPC_UA' : 'UNKNOWN';
          const provider = this.providerFactory.getProvider(protocolStr);
          const connInfo = JSON.parse(ds.connectionInfo) as OpcUaConnectionDto;

          const rawEntitiesToInsertPulse: Partial<PulseDataMeasurement>[] = [];
          const rawEntitiesToInsertTotal: Partial<TotalDataMeasurement>[] = [];

          const pulseMeterIds = new Set(pulseChannels.map((c) => c.meter.id));
          const totalMeterIds = new Set(totalChannels.map((c) => c.meter.id));

          // --- NOWOŚĆ: POBIERANIE NAJNOWSZYCH TIMESTAMPÓW Z BAZY ---
          // Pobieramy mapę [meterId -> najnowsza_data_w_bazie] dla obu tabel
          const latestPulseTimestamps = await this.getLatestTimestamps(
            PulseDataMeasurement,
            Array.from(pulseMeterIds),
          );
          const latestTotalTimestamps = await this.getLatestTimestamps(
            TotalDataMeasurement,
            Array.from(totalMeterIds),
          );

          // 4. Pobieranie danych ze sterownika
          for (const mapping of uniqueMappings.values()) {
            this.logger.log(
              `Pobieranie danych dla źródła ID: ${ds.id} (${protocolStr})...`,
            );
            const readings = await provider.readBulk(connInfo, mapping);

            // 5. Segregacja i FILTROWANIE DUPLIKATÓW
            for (const reading of readings) {
              const readingTime = new Date(reading.timestamp).getTime();

              // Kanał impulsowy
              if (pulseMeterIds.has(reading.meterId)) {
                const latestDbTime =
                  latestPulseTimestamps.get(reading.meterId)?.getTime() || 0;

                // Zapisujemy tylko wtedy, gdy odczyt z PLC jest NOWSZY niż to, co mamy w bazie
                if (readingTime > latestDbTime) {
                  rawEntitiesToInsertPulse.push({
                    meter: { id: reading.meterId } as Meter,
                    pulses: Math.round(reading.value),
                    timestamp: reading.timestamp,
                    createdAt: new Date(),
                  });
                }
              }

              // Kanał całkowity
              if (totalMeterIds.has(reading.meterId)) {
                const latestDbTime =
                  latestTotalTimestamps.get(reading.meterId)?.getTime() || 0;

                // Zapisujemy tylko wtedy, gdy odczyt z PLC jest NOWSZY niż to, co mamy w bazie
                if (readingTime > latestDbTime) {
                  rawEntitiesToInsertTotal.push({
                    meter: { id: reading.meterId } as Meter,
                    value: reading.value,
                    timestamp: reading.timestamp,
                    createdAt: new Date(),
                  });
                }
              }
            }
          }

          // 6. Masowy zapis tylko przefiltrowanych, nowych rekordów
          if (rawEntitiesToInsertPulse.length > 0) {
            await this.bulkInsert(
              PulseDataMeasurement,
              rawEntitiesToInsertPulse,
            );
            totalRecordsSaved += rawEntitiesToInsertPulse.length;
          }
          if (rawEntitiesToInsertTotal.length > 0) {
            await this.bulkInsert(
              TotalDataMeasurement,
              rawEntitiesToInsertTotal,
            );
            totalRecordsSaved += rawEntitiesToInsertTotal.length;
          }
        } catch (sourceError) {
          this.logger.error(
            `Błąd synchronizacji dla DataSource ID ${ds.id}: ${sourceError instanceof Error ? sourceError.message : String(sourceError)}`,
          );
        }
      }

      if (totalRecordsSaved > 0) {
        this.eventEmitter.emit('data.synchronized', {
          timestamp: new Date(),
          recordsSaved: totalRecordsSaved,
        });
      }

      this.logger.log(
        `Cykl zakończony pomyślnie. Czas: ${(Date.now() - startTime) / 1000}s. Zapisano NOWYCH: ${totalRecordsSaved} rekordów.`,
      );
    } catch (globalError) {
      this.logger.error(
        'Krytyczny błąd w głównej pętli synchronizacji.',
        globalError,
      );
    }
    {
      this.isProcessing = false;
    }
  }

  /**
   * Metoda pomocnicza: Pobiera najnowszy timestamp dla podanych ID liczników z wybranej tabeli pomiarowej
   */
  private async getLatestTimestamps(
    entityClass: new () => any,
    meterIds: number[],
  ): Promise<Map<number, Date>> {
    const resultMap = new Map<number, Date>();
    if (meterIds.length === 0) return resultMap;

    // Wykonujemy jedno szybkie zapytanie grupujące (MAX timestamp dla każdego meterId)
    const rawResults = await this.typeOrmDataSource
      .createQueryRunner()
      .manager.createQueryBuilder()
      .select('meterId')
      .addSelect('MAX(timestamp)', 'latestTimestamp')
      .from(entityClass, 'measurement')
      .where('meterId IN (:...meterIds)', { meterIds })
      .groupBy('meterId')
      .getRawMany<{ meterId: number; latestTimestamp: Date | null }>();

    rawResults.forEach((row) => {
      if (row.latestTimestamp) {
        resultMap.set(row.meterId, new Date(row.latestTimestamp));
      }
    });

    return resultMap;
  }

  /**
   * Generyczny mechanizm bezpiecznego wstawiania tysięcy rekordów na raz do MSSQL.
   */
  private async bulkInsert<T>(
    entityClass: new () => T,
    data: Partial<T>[],
  ): Promise<void> {
    const CHUNK_SIZE = 400;
    const queryRunner = this.typeOrmDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < data.length; i += CHUNK_SIZE) {
        const chunk = data.slice(i, i + CHUNK_SIZE);
        await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(entityClass)
          // Rzutujemy przez unknown na dedykowany typ TypeORM, by zamknąć usta linterowi
          .values(chunk as unknown as QueryDeepPartialEntity<T>[])
          .execute();
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
