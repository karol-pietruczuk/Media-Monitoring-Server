import { Module } from '@nestjs/common';
import { DataBaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Counter } from './entities/database.counter.entity';
import { Location } from './entities/database.location.entity';
import { MediaCalculatedData } from './entities/database.media-calculated-data.entity';
import { MediaMeasurement } from './entities/database.media-measurement.entity';

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
