import { Module } from '@nestjs/common';
import { DataBaseService } from './data-base.service';

@Module({
  providers: [DataBaseService],
})
export class DatabaseModule {}
