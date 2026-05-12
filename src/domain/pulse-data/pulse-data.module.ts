import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PulseDataCalculated } from './entities/pulse-data-calculated.entity';
import { PulseDataMeasurement } from './entities/pulse-data-measurement.entity';
import { PulseDataMultiplier } from './entities/pulse-data-multiplier.entity';
import { PulseDataMultiplierHistory } from './entities/pulse-data-multiplier-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PulseDataCalculated,
      PulseDataMeasurement,
      PulseDataMultiplier,
      PulseDataMultiplierHistory,
    ]),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class PulseDataModule {}
