import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meter } from './entities/meter.entity';
import { MeterHistory } from './entities/meter-history.entity';
import { MeterCalibration } from './entities/meter-calibration.entity';
import { MeterCalibrationHistory } from './entities/meter-calibration-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Meter,
      MeterHistory,
      MeterCalibration,
      MeterCalibrationHistory,
    ]),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class MeterModule {}
