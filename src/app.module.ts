import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataBaseModule } from './infrastructure/database/database.module';
import { DataSyncModule } from './feature/data-sync/data-sync.module';
import { DataBaseService } from './infrastructure/database/database.service';
import { LocationModule } from './domain/location/location.module';
import { LocationService } from './domain/location/location.service';
import { MeterModule } from './domain/meter/meter.module';
import { PulseDataModule } from './domain/pulse-data/pulse-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LocationModule,
    MeterModule,
    PulseDataModule,
    DataSyncModule,
    DataBaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataBaseService, LocationService],
})
export class AppModule {}
