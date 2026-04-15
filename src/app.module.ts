import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataPlcModule } from './data-plc/data-plc.module';
import { DataBaseModule } from './data-base/data-base.module';
import { DataSyncModule } from './data-sync/data-sync.module';
import { DataBaseService } from './data-base/data-base.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Counter } from './data-base/entities/data.counter.entity';
import { MediaCalculatedData } from './data-base/entities/data.media-calculated-data.entity';
import { MediaMeasurement } from './data-base/entities/data.media-measurement.entity';
import { Location } from './data-base/entities/data.location.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forFeature([
      Counter,
      MediaCalculatedData,
      MediaMeasurement,
      Location,
    ]),
    DataPlcModule,
    DataBaseModule,
    DataSyncModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataBaseService],
})
export class AppModule {}
