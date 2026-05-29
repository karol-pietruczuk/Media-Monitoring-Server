import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource as TypeOrmDataSource } from 'typeorm';
import { User } from '../../domain/user/entities/user.entity';
import { Location } from '../../domain/location/entities/location.entity';
import { Meter } from '../../domain/meter/entities/meter.entity';
import { MeterCalibration } from '../../domain/meter/entities/meter-calibration.entity';
import { PulseDataChannel } from '../../domain/pulse-data/entities/pulse-data-channel.entity';
import { DataSource } from '../../domain/data-source/entities/data-source.entity';

// === NOWE IMPORTY ENCJI KONFIGURACYJNYCH ===
// Zweryfikuj poniższe ścieżki importu, jeśli Twoja struktura katalogów się różni!
import { PulseDataMultiplier } from '../../domain/pulse-data/entities/pulse-data-multiplier.entity';
import { TotalDataChannel } from '../../domain/total-data/entities/total-data-channel.entity';

// --- INTERFEJS BEZPIECZEŃSTWA TYPÓW DLA REKORDU BACKUPU ---
export interface BackupPayload {
  version: string;
  createdAt: string;
  users?: Partial<User>[];
  locations?: Partial<Location>[];
  dataSources?: Partial<DataSource>[];
  totalChannels?: Partial<TotalDataChannel>[]; // NOWOŚĆ
  meters?: Partial<Meter>[];
  calibrations?: Partial<MeterCalibration>[];
  pulseChannels?: Partial<PulseDataChannel>[];
  multipliers?: Partial<PulseDataMultiplier>[]; // NOWOŚĆ
}

@Injectable()
export class BackupService {
  constructor(private readonly dataSource: TypeOrmDataSource) {}

  /**
   * Agreguje wszystkie tabele konfiguracyjne do jednego wielkiego obiektu JSON
   */
  async createBackupPayload(): Promise<BackupPayload> {
    return {
      version: '1.0',
      createdAt: new Date().toISOString(),
      users: await this.dataSource.getRepository(User).find(),
      locations: await this.dataSource.getRepository(Location).find(),
      dataSources: await this.dataSource.getRepository(DataSource).find(),

      // Pobieranie nowych tabel słownikowych/konfiguracyjnych
      totalChannels: await this.dataSource
        .getRepository(TotalDataChannel)
        .find(),
      multipliers: await this.dataSource
        .getRepository(PulseDataMultiplier)
        .find(),

      meters: await this.dataSource
        .getRepository(Meter)
        .find({ relations: ['location'] }),
      calibrations: await this.dataSource
        .getRepository(MeterCalibration)
        .find({ relations: ['meter'] }),
      pulseChannels: await this.dataSource
        .getRepository(PulseDataChannel)
        .find({ relations: ['meter', 'dataSource'] }),
    };
  }

  /**
   * Odtwarza stan bazy z przesłanego obiektu w bezpiecznej transakcji
   */
  async restoreFromPayload(payload: BackupPayload): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. CZYSZCZENIE BAZY W ODWRÓCONEJ KOLEJNOŚCI ZALEŻNOŚCI (chroni przed FK constraint error)
      await queryRunner.manager.query('DELETE FROM pulse_data_channel');
      await queryRunner.manager.query('DELETE FROM pulse_data_multiplier'); // NOWOŚĆ
      await queryRunner.manager.query('DELETE FROM total_data_channel'); // NOWOŚĆ
      await queryRunner.manager.query('DELETE FROM meter_calibration');
      await queryRunner.manager.query('DELETE FROM meter');
      await queryRunner.manager.query('DELETE FROM location');
      await queryRunner.manager.query('DELETE FROM data_source');
      await queryRunner.manager.query('DELETE FROM [user]');

      // 2. IMPORT DANYCH W KOLEJNOŚCI INTEGRALNOŚCI STRUKTURALNEJ

      // A. Słowniki i konfiguracje podstawowe (niezależne)
      if (payload.users && payload.users.length > 0) {
        const entities = queryRunner.manager.create(User, payload.users);
        await queryRunner.manager.save(User, entities);
      }
      if (payload.locations && payload.locations.length > 0) {
        const entities = queryRunner.manager.create(
          Location,
          payload.locations,
        );
        await queryRunner.manager.save(Location, entities);
      }
      if (payload.dataSources && payload.dataSources.length > 0) {
        const entities = queryRunner.manager.create(
          DataSource,
          payload.dataSources,
        );
        await queryRunner.manager.save(DataSource, entities);
      }
      if (payload.totalChannels && payload.totalChannels.length > 0) {
        const entities = queryRunner.manager.create(
          TotalDataChannel,
          payload.totalChannels,
        );
        await queryRunner.manager.save(TotalDataChannel, entities);
      }

      // B. Liczniki pomiarowe (Wymagają już zaimportowanej lokalizacji)
      if (payload.meters && payload.meters.length > 0) {
        const entities = queryRunner.manager.create(Meter, payload.meters);
        await queryRunner.manager.save(Meter, entities);
      }

      // C. Dane zależne od liczników (Kalibracje, Kanały, Mnożniki)
      if (payload.calibrations && payload.calibrations.length > 0) {
        const entities = queryRunner.manager.create(
          MeterCalibration,
          payload.calibrations,
        );
        await queryRunner.manager.save(MeterCalibration, entities);
      }
      if (payload.pulseChannels && payload.pulseChannels.length > 0) {
        const entities = queryRunner.manager.create(
          PulseDataChannel,
          payload.pulseChannels,
        );
        await queryRunner.manager.save(PulseDataChannel, entities);
      }
      if (payload.multipliers && payload.multipliers.length > 0) {
        const entities = queryRunner.manager.create(
          PulseDataMultiplier,
          payload.multipliers,
        );
        await queryRunner.manager.save(PulseDataMultiplier, entities);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Krytyczny błąd przywracania bazy. Transakcja została cofnięta. Szczegóły: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
