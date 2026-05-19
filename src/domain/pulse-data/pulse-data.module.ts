import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PulseDataCalculated } from './entities/pulse-data-calculated.entity';
import { PulseDataMeasurement } from './entities/pulse-data-measurement.entity';
import { PulseDataMultiplier } from './entities/pulse-data-multiplier.entity';
import { PulseDataMultiplierHistory } from './entities/pulse-data-multiplier-history.entity';
import { PulseDataChannel } from './entities/pulse-data-channel.entity';
import { PulseDataChannelHistory } from './entities/pulse-data-channel-history.entity';
import { PulseDataService } from './pulse-data.service';
import { PulseDataController } from './pulse-data.controller';
import { PulseDataHistoryListener } from './listeners/pulse-data-history.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PulseDataCalculated,
      PulseDataMeasurement,
      PulseDataMultiplier,
      PulseDataMultiplierHistory,
      PulseDataChannel,
      PulseDataChannelHistory,
    ]),
  ],
  controllers: [PulseDataController],
  providers: [PulseDataService, PulseDataHistoryListener],
  exports: [TypeOrmModule, PulseDataService], // Eksportujemy serwis, aby moduł Meter mógł wstrzykiwać operacje kalkulacji
})
export class PulseDataModule {}
