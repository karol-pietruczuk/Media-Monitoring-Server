import { Module } from '@nestjs/common';
import { DataBaseService } from './data-base.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Counter } from './entities/data.counter.entity';
import { Location } from './entities/data.location.entity';
import { MediaCalculatedData } from './entities/data.media-calculated-data.entity';
import { MediaMeasurement } from './entities/data.media-measurement.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: '192.168.92.100',
      port: 1433,
      username: 'Node_User',
      password: '123',
      database: 'Test',
      autoLoadEntities: true,
      synchronize: true, // ⚠️ tylko dev!
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    }),
    TypeOrmModule.forFeature([
      Counter,
      MediaCalculatedData,
      MediaMeasurement,
      Location,
    ]),
  ],
  providers: [DataBaseService],
})
export class DataBaseModule {}
