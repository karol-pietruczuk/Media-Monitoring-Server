import { Module } from '@nestjs/common';
import { DataPlcService } from './data-plc.service';

@Module({
  providers: [DataPlcService],
})
export class DataPlcModule {}
