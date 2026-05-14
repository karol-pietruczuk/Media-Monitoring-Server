import { Module } from '@nestjs/common';
import { OpcUaService } from './opcua.service';

@Module({
  providers: [OpcUaService],
  exports: [OpcUaService],
})
export class OpcUaModule {}
