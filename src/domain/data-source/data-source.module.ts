import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from './entities/data-source.entity';
import { DataSourceHistory } from './entities/data-source-history.entity';
import { DataSourceService } from './data-source.service';
import { DataSourceController } from './data-source.controller';
import { DataSourceHistoryListener } from './listeners/data-source-history.listener';

@Module({
  imports: [TypeOrmModule.forFeature([DataSource, DataSourceHistory])],
  controllers: [DataSourceController],
  providers: [DataSourceService, DataSourceHistoryListener],
  exports: [DataSourceService], // Eksportujemy serwis, jeśli inne moduły będą musiały weryfikować połączenia
})
export class DataSourceModule {}
