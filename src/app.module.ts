import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataPlcModule } from './data-plc/data-plc.module';
import { DataBaseModule } from './database/database.module';
import { DataSyncModule } from './data-sync/data-sync.module';
import { DataBaseService } from './database/database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Counter } from './database/entities/database.counter.entity';
import { MediaCalculatedData } from './database/entities/database.media-calculated-data.entity';
import { MediaMeasurement } from './database/entities/database.media-measurement.entity';
import { Location } from './database/entities/database.location.entity';

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
