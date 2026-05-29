// File: meter/meter.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Meter } from './entities/meter.entity';
import { MeterCalibration } from './entities/meter-calibration.entity';
import { CreateMeterDto } from './dto/create-meter.dto';
import { UpdateMeterDto } from './dto/update-meter.dto';
import { CreateCalibrationDto } from './dto/create-calibration.dto';
import { MeterUpdatedEvent } from './events/meter-updated.event';
import { MeterCalibrationUpdatedEvent } from './events/meter-calibration-updated.event';
import { MeterChange } from '../../core/enums/meter-change.enum';
import { MeterCalibrationChange } from '../../core/enums/meter-calibration-change.enum';
import { Location } from '../location/entities/location.entity';

// === IMPORTY POWIĄZANYCH ENCJI DANYCH IMPULSOWYCH ===
import { PulseDataCalculated } from '../pulse-data/entities/pulse-data-calculated.entity';
import { PulseDataMultiplier } from '../pulse-data/entities/pulse-data-multiplier.entity';

@Injectable()
export class MeterService {
  constructor(
    @InjectRepository(Meter)
    private readonly meterRepository: Repository<Meter>,
    @InjectRepository(MeterCalibration)
    private readonly calibrationRepository: Repository<MeterCalibration>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Tworzy nowy licznik oraz automatycznie inicjalizuje encje PulseDataCalculated i PulseDataMultiplier.
   * Transakcja gwarantuje stabilność danych, a event historii wysyłany jest po COMMIT bazy.
   */
  async create(
    dto: CreateMeterDto,
    changedById: number | null,
  ): Promise<Meter> {
    let savedMeter: Meter;

    // Otwieramy transakcję bazodanową
    await this.meterRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // 1. Tworzymy i zapisujemy podstawowy obiekt licznika
        const meter = transactionalEntityManager.create(Meter, {
          name: dto.name,
          symbol: dto.symbol,
          unit: dto.unit,
          location: { id: dto.locationId } as Location,
        });
        savedMeter = await transactionalEntityManager.save(Meter, meter);

        // 2. Automatycznie inicjalizujemy licznik impulsów wartościami startowymi (0)
        const initialCalculated = transactionalEntityManager.create(
          PulseDataCalculated,
          {
            pulsesAfterLastCalibration: 0,
            actualValue: 0.0,
            actualTimestamp: new Date(),
            meter: savedMeter,
          },
        );
        await transactionalEntityManager.save(
          PulseDataCalculated,
          initialCalculated,
        );

        // 3. Automatycznie tworzymy domyślny mnożnik licznika (wartość 1.0)
        const initialMultiplier = transactionalEntityManager.create(
          PulseDataMultiplier,
          {
            value: 1.0,
            expirationDateFrom: new Date(),
            meter: savedMeter,
          },
        );
        await transactionalEntityManager.save(
          PulseDataMultiplier,
          initialMultiplier,
        );
      },
    );

    // POZA TRANSAKCJĄ (Po udanym COMMIT): Emitujemy zdarzenie zapisu do historii
    this.eventEmitter.emit(
      'meter.updated',
      new MeterUpdatedEvent(
        savedMeter!.id,
        changedById,
        MeterChange.CreatedMeter,
        {},
        {
          name: dto.name,
          symbol: dto.symbol,
          unit: dto.unit,
          locationId: dto.locationId,
        },
      ),
    );

    return savedMeter!;
  }

  /**
   * Pobiera listę wszystkich liczników wraz z powiązanymi strukturami danych
   */
  async findAll(): Promise<Meter[]> {
    return this.meterRepository.find({
      relations: [
        'location',
        'pulseDataChannel',
        'totalDataChannel',
        'pulseDataCalculated',
      ],
    });
  }

  /**
   * Pobiera szczegółowe dane pojedynczego licznika na podstawie ID
   */
  async findById(id: number): Promise<Meter> {
    const meter = await this.meterRepository.findOne({
      where: { id },
      relations: ['location', 'pulseDataChannel', 'totalDataChannel'],
    });
    if (!meter) {
      throw new NotFoundException(`Licznik o ID ${id} nie został odnaleziony.`);
    }
    return meter;
  }

  /**
   * Aktualizuje konfigurację strukturalną wybranego licznika
   */
  async update(
    id: number,
    dto: UpdateMeterDto,
    changedById: number,
  ): Promise<Meter> {
    const meter = await this.findById(id);

    const oldValues = {
      name: meter.name,
      symbol: meter.symbol,
      unit: meter.unit,
      locationId: meter.location?.id,
    };

    if (dto.name) meter.name = dto.name;
    if (dto.symbol) meter.symbol = dto.symbol;
    if (dto.unit) meter.unit = dto.unit;
    if (dto.locationId) meter.location = { id: dto.locationId } as Location;

    const updated = await this.meterRepository.save(meter);

    // Emisja eventu po udanym zapisie pojedynczego obiektu
    this.eventEmitter.emit(
      'meter.updated',
      new MeterUpdatedEvent(
        id,
        changedById,
        MeterChange.UpdatedMeter,
        oldValues,
        {
          name: meter.name,
          symbol: meter.symbol,
          unit: meter.unit,
          locationId: dto.locationId ?? oldValues.locationId,
        },
      ),
    );

    return updated;
  }

  /**
   * Trwale usuwa licznik, czyszcząc automatycznie powiązane tabele przeliczeń w transakcji.
   * Chroni integralność bazy w przypadku istnienia historycznych serii pomiarowych.
   */
  async remove(id: number, changedById: number): Promise<void> {
    const meter = await this.findById(id);
    const oldValues = {
      name: meter.name,
      symbol: meter.symbol,
      unit: meter.unit,
    };

    try {
      // Wykonujemy kaskadowe czyszczenie struktur wyliczeniowych w transakcji
      await this.meterRepository.manager.transaction(
        async (transactionalEntityManager) => {
          // 1. Usuwamy rekordy z pulseDataCalculated przypisane do tego licznika
          await transactionalEntityManager.delete(PulseDataCalculated, {
            meterId: id,
          });

          // 2. Usuwamy rekordy z pulseDataMultiplier przypisane do tego licznika
          await transactionalEntityManager.delete(PulseDataMultiplier, {
            meter: { id },
          });

          // 3. Usuwamy właściwy licznik
          await transactionalEntityManager.remove(Meter, meter);
        },
      );
    } catch (error: unknown) {
      // Bezpieczne przechwycenie błędu naruszenia klucza obcego w bazie MS SQL (np. istniejące pomiary)
      const sqlError = error as Error & { code?: string; number?: number };
      if (
        sqlError.code === 'EREQUEST' ||
        sqlError.number === 547 ||
        (error instanceof Error && error.message.includes('FOREIGN KEY'))
      ) {
        throw new ConflictException(
          'Nie można usunąć licznika, ponieważ posiada on przypisane historyczne pomiary, kalibracje lub kanały danych.',
        );
      }
      throw error;
    }

    // POZA TRANSAKCJĄ: Jeśli transakcja zakończyła się sukcesem, bezpiecznie logujemy zdarzenie usunięcia
    this.eventEmitter.emit(
      'meter.updated',
      new MeterUpdatedEvent(
        id,
        changedById,
        MeterChange.DeletedMeter,
        oldValues,
        {},
      ),
    );
  }

  /**
   * Logika dodawania nowego punktu kalibracyjnego / odczytu kontrolnego
   */
  async addCalibration(
    dto: CreateCalibrationDto,
    changedById: number | null,
  ): Promise<MeterCalibration> {
    const calibration = this.calibrationRepository.create({
      value: dto.value,
      timestamp: new Date(dto.timestamp),
      meter: { id: dto.meterId } as Meter,
    });

    const saved = await this.calibrationRepository.save(calibration);

    this.eventEmitter.emit(
      'meter-calibration.updated',
      new MeterCalibrationUpdatedEvent(
        saved.id,
        changedById,
        MeterCalibrationChange.CreatedMeterCalibration,
        {},
        { meterId: dto.meterId, value: dto.value, timestamp: dto.timestamp },
      ),
    );

    return saved;
  }
}
