// File: meter/meter.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meter } from './entities/meter.entity';
import { MeterHistory } from './entities/meter-history.entity';
import { MeterCalibration } from './entities/meter-calibration.entity';
import { MeterCalibrationHistory } from './entities/meter-calibration-history.entity';
import { MeterService } from './meter.service';
import { MeterController } from './meter.controller';
import { MeterHistoryListener } from './listeners/meter-history.listener';
import { PulseDataModule } from '../pulse-data/pulse-data.module'; // <-- NOWOŚĆ

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Meter,
      MeterHistory,
      MeterCalibration,
      MeterCalibrationHistory,
    ]),
    PulseDataModule,
  ],
  controllers: [MeterController],
  providers: [MeterService, MeterHistoryListener],
  exports: [TypeOrmModule, MeterService],
})
export class MeterModule {}
