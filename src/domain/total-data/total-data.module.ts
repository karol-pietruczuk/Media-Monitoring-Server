import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TotalDataChannel } from './entities/total-data-channel.entity';
import { TotalDataChannelHistory } from './entities/total-data-channel-history.entity';
import { TotalDataMeasurement } from './entities/total-data-measurement.entity';
import { TotalDataService } from './total-data.service';
import { TotalDataController } from './total-data.controller';
import { TotalDataHistoryListener } from './listeners/total-data-history.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TotalDataChannel,
      TotalDataChannelHistory,
      TotalDataMeasurement,
    ]),
  ],
  controllers: [TotalDataController],
  providers: [TotalDataService, TotalDataHistoryListener],
  exports: [TypeOrmModule, TotalDataService], // Eksportujemy serwis do użycia w agregacie Meter
})
export class TotalDataModule {}
