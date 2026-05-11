import { Module } from '@nestjs/common';
import { DataBaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Counter } from './entities/counter.entity';
import { CalculatedData } from './entities/calculated-data.entity';
import { Measurement } from './entities/measurement.entity';
import { Calibration } from './entities/calibration.entity';
import { Multiplier } from './entities/multiplier.entity';
import { dataSourceOptions } from './data-source';
import { MultiplierHistory } from './entities/multiplier-history.entity';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([
      Counter,
      CalculatedData,
      Measurement,
      Calibration,
      Multiplier,
      MultiplierHistory,
    ]),
    LocationModule,
  ],
  providers: [DataBaseService],
})
export class DataBaseModule {}
