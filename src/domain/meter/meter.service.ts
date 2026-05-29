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

// === NOWE IMPORTY ENCJI POWIĄZANYCH ===
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
   * Tworzy licznik oraz automatycznie inicjalizuje encje PulseDataCalculated i PulseDataMultiplier
   */
  async create(
    dto: CreateMeterDto,
    changedById: number | null,
  ): Promise<Meter> {
    // Wykonujemy operację w transakcji, aby zagwarantować spójność (wszystko albo nic)
    return await this.meterRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // 1. Tworzymy i zapisujemy bazową encję Meter
        const meter = transactionalEntityManager.create(Meter, {
          name: dto.name,
          symbol: dto.symbol,
          unit: dto.unit,
          location: { id: dto.locationId } as Location,
        });
        const savedMeter = await transactionalEntityManager.save(Meter, meter);

        // 2. Automatycznie tworzymy encję PulseDataCalculated z wartościami początkowymi
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

        // 3. Automatycznie tworzymy encję PulseDataMultiplier (domyślny mnożnik = 1.0)
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

        // 4. Emitujemy zdarzenie utworzenia licznika
        this.eventEmitter.emit(
          'meter.updated',
          new MeterUpdatedEvent(
            savedMeter.id,
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

        return savedMeter;
      },
    );
  }

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
   * Usuwa licznik i automatycznie czyści powiązane encje kalkulacji/mnożników
   */
  async remove(id: number, changedById: number): Promise<void> {
    const meter = await this.findById(id);
    const oldValues = {
      name: meter.name,
      symbol: meter.symbol,
      unit: meter.unit,
    };

    try {
      // Wykonujemy czyszczenie w transakcji
      await this.meterRepository.manager.transaction(
        async (transactionalEntityManager) => {
          // 1. Ręcznie usuwamy encje zależne, by uniknąć błędów kluczy obcych (FK Constraint)
          await transactionalEntityManager.delete(PulseDataCalculated, {
            meterId: id,
          });
          await transactionalEntityManager.delete(PulseDataMultiplier, {
            meter: { id },
          });

          // 2. Usuwamy właściwy licznik
          await transactionalEntityManager.remove(Meter, meter);
        },
      );
    } catch (error: unknown) {
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
