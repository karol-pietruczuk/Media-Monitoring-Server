import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TotalDataChannel } from './entities/total-data-channel.entity';
import { TotalDataChannelHistory } from './entities/total-data-channel-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TotalDataChannel, TotalDataChannelHistory]),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class TotalDataModule {}
