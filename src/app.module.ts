import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataPlcModule } from './data-plc/data-plc.module';
import { DatabaseModule } from './data-base/data-base.module';
import { DataSyncModule } from './data-sync/data-sync.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DataPlcModule,
    DatabaseModule,
    DataSyncModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
