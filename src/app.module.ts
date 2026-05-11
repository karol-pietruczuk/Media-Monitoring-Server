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
import { Counter } from './database/entities/counter.entity';
import { CalculatedData } from './database/entities/calculated-data.entity';
import { Measurement } from './database/entities/measurement.entity';
import { Location } from './database/entities/location.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forFeature([Counter, CalculatedData, Measurement, Location]),
    DataPlcModule,
    DataBaseModule,
    DataSyncModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataBaseService],
})
export class AppModule {}
