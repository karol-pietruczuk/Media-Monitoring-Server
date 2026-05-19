import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { LocationService } from './location.service';
import { LocationHistory } from './entities/location-history.entity';
import { LocationController } from './location.controller';
import { LocationHistoryListener } from './listeners/location-history.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Location, LocationHistory])],
  controllers: [LocationController],
  providers: [LocationService, LocationHistoryListener],
  exports: [TypeOrmModule, LocationService],
})
export class LocationModule {}
