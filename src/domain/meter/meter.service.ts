import { Injectable, NotFoundException } from '@nestjs/common';
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
import { Location } from '../location/entities/location.entity'; // KLUCZOWY IMPORT TWOJEJ ENCJI ZAMIAST NATYWNEGO OBIEKTU WEB

@Injectable()
export class MeterService {
  constructor(
    @InjectRepository(Meter)
    private readonly meterRepository: Repository<Meter>,
    @InjectRepository(MeterCalibration)
    private readonly calibrationRepository: Repository<MeterCalibration>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    dto: CreateMeterDto,
    changedById: number | null,
  ): Promise<Meter> {
    const meter = this.meterRepository.create({
      name: dto.name,
      symbol: dto.symbol,
      unit: dto.unit,
      location: { id: dto.locationId } as Location, // Teraz asercja przejdzie bezbłędnie
    });

    const saved = await this.meterRepository.save(meter);

    this.eventEmitter.emit(
      'meter.updated',
      new MeterUpdatedEvent(
        saved.id,
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

    return saved;
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
    // Zapewniamy pełną konfigurację obiektu wyszukiwania pojedynczego rekordu
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

  async remove(id: number, changedById: number): Promise<void> {
    const meter = await this.findById(id);
    const oldValues = {
      name: meter.name,
      symbol: meter.symbol,
      unit: meter.unit,
    };

    await this.meterRepository.remove(meter);

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

  // --- LOGIKA KALIBRACJI LICZNIKA ---
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
