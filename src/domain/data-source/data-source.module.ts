import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from './entities/data-source.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DataSource])],
  providers: [],
  exports: [TypeOrmModule],
})
export class DataSourceModule {}
