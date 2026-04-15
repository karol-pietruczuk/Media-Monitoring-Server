import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { DataBaseService } from './data-base/data-base.service';
import { CreateLocationDto } from './data-base/dto/create-location.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataBaseService: DataBaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async TESTCreateLocation(@Body() createLocationDto: CreateLocationDto) {
    return await this.dataBaseService.createLocation(createLocationDto);
  }
}
