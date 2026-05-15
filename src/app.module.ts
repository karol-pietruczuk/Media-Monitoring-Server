import { Module, DynamicModule } from '@nestjs/common';
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
import { DataSourceModule } from './domain/data-source/data-source.module';
import { TotalDataModule } from './domain/total-data/total-data.module';
import { OpcUaModule } from './infrastructure/opcua/opcua.module';
import { UserModule } from './domain/user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    (
      EventEmitterModule as unknown as { forRoot: () => DynamicModule }
    ).forRoot(),
    DataSourceModule,
    LocationModule,
    MeterModule,
    PulseDataModule,
    TotalDataModule,
    DataSyncModule,
    DataBaseModule,
    OpcUaModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataBaseService, LocationService],
})
export class AppModule {}
