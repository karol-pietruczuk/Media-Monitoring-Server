import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSyncService } from './data-sync.service';

// Importy z warstwy infrastruktury
import { OpcUaModule } from '../../infrastructure/opcua/opcua.module';
import { DataProviderFactory } from '../../infrastructure/data-provider-factory';

// Twoje encje
import { DataSource } from '../../domain/data-source/entities/data-source.entity';
import { PulseDataChannel } from '../../domain/pulse-data/entities/pulse-data-channel.entity';
import { TotalDataChannel } from '../../domain/total-data/entities/total-data-channel.entity';
import { PulseDataMeasurement } from '../../domain/pulse-data/entities/pulse-data-measurement.entity';
import { TotalDataMeasurement } from '../../domain/total-data/entities/total-data-measurement.entity';

@Module({
  imports: [
    OpcUaModule, // Posiada wyeksportowany OpcUaService
    TypeOrmModule.forFeature([
      DataSource,
      PulseDataChannel,
      TotalDataChannel,
      PulseDataMeasurement,
      TotalDataMeasurement,
    ]),
  ],
  providers: [DataSyncService, DataProviderFactory],
})
export class DataSyncModule {}
