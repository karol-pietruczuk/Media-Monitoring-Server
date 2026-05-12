import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { DataBaseService } from './infrastructure/database/database.service';
import { CreateLocationDto } from './domain/location/dto/create-location.dto';
import { LocationService } from './domain/location/location.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataBaseService: DataBaseService,
    private readonly locationService: LocationService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async TESTCreateLocation(@Body() createLocationDto: CreateLocationDto) {
    return await this.locationService.createLocation(createLocationDto);
  }
}
