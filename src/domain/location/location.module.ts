import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { LocationService } from './location.service';
import { LocationHistory } from './entities/location-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, LocationHistory])],
  providers: [LocationService],
  exports: [TypeOrmModule],
})
export class LocationModule {}
