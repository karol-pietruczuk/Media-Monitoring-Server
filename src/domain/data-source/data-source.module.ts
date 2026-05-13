import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from './entities/data-source.entity';
import { DataSourceHistory } from './entities/data-source-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DataSource, DataSourceHistory])],
  providers: [],
  exports: [TypeOrmModule],
})
export class DataSourceModule {}
