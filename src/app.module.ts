import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataPlcModule } from './data-plc/data-plc.module';
import { DatabaseModule } from './data-base/data-base.module';
import { DataSyncModule } from './data-sync/data-sync.module';

@Module({
  imports: [DataPlcModule, DatabaseModule, DataSyncModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
