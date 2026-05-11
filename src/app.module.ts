import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataPlcModule } from './data-plc/data-plc.module';
import { DataBaseModule } from './database/database.module';
import { DataSyncModule } from './data-sync/data-sync.module';
import { DataBaseService } from './database/database.service';
import { LocationModule } from './location/location.module';
import { LocationService } from './location/location.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DataPlcModule,
    DataBaseModule,
    DataSyncModule,
    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataBaseService, LocationService],
})
export class AppModule {}
