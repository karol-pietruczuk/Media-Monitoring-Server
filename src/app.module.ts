import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlcModuleModule } from './plc-module/plc-module.module';

@Module({
  imports: [PlcModuleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
