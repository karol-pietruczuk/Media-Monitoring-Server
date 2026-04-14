import { Module } from '@nestjs/common';
import { DataBaseService } from './data-base.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Counters } from './entities/data.counters.entity';
import { Locations } from './entities/data.locations.entity';
import { MediaMeasurements } from './entities/data.media-measurements.entity';
import { MediaCalculatedData } from './entities/data.media-calculated-data.entity';

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
      //synchronize: true, // ⚠️ tylko dev!
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
      entities: [Counters, MediaCalculatedData, MediaMeasurements, Locations],
    }),
  ],
  providers: [DataBaseService],
})
export class DatabaseModule {}
