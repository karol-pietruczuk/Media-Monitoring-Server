import { Module } from '@nestjs/common';
import { DataBaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
    }),
  ],
  providers: [DataBaseService],
})
export class DataBaseModule {}
