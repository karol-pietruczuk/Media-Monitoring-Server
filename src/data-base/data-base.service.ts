import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateLocationDto } from './dto/create-location.dto';
import { Location } from './entities/data.location.entity';

@Injectable()
export class DataBaseService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async createLocation(createLocationDto: CreateLocationDto) {
    const locationData = plainToInstance(Location, createLocationDto);
    const location = this.locationRepository.create(locationData);
    return await this.locationRepository.save(location);
  }
}
