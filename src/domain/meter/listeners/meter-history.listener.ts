import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeterHistory } from '../entities/meter-history.entity';
import { MeterCalibrationHistory } from '../entities/meter-calibration-history.entity';
import { MeterUpdatedEvent } from '../events/meter-updated.event';
import { MeterCalibrationUpdatedEvent } from '../events/meter-calibration-updated.event';

@Injectable()
export class MeterHistoryListener {
  constructor(
    @InjectRepository(MeterHistory)
    private readonly meterHistoryRepository: Repository<MeterHistory>,
    @InjectRepository(MeterCalibrationHistory)
    private readonly calibrationHistoryRepository: Repository<MeterCalibrationHistory>,
  ) {}

  @OnEvent('meter.updated', { async: true })
  async handleMeterUpdated(event: MeterUpdatedEvent): Promise<void> {
    const history = new MeterHistory();
    history.meterId = event.meterId;
    history.changedById = event.changedById ?? null;
    history.meterChange = event.changeType;
    history.oldValues =
      Object.keys(event.oldValues).length > 0
        ? JSON.stringify(event.oldValues)
        : null;
    history.newValues =
      Object.keys(event.newValues).length > 0
        ? JSON.stringify(event.newValues)
        : null;

    await this.meterHistoryRepository.save(history);
  }

  @OnEvent('meter-calibration.updated', { async: true })
  async handleCalibrationUpdated(
    event: MeterCalibrationUpdatedEvent,
  ): Promise<void> {
    const history = new MeterCalibrationHistory();
    history.meterCalibrationId = event.calibrationId;
    history.changedById = event.changedById ?? null;
    history.meterCalibrationChangeType = event.changeType;
    history.oldValues =
      Object.keys(event.oldValues).length > 0
        ? JSON.stringify(event.oldValues)
        : null;
    history.newValues =
      Object.keys(event.newValues).length > 0
        ? JSON.stringify(event.newValues)
        : null;

    await this.calibrationHistoryRepository.save(history);
  }
}
