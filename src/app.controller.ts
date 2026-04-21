import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { DataBaseService } from './database/database.service';
import { CreateLocationDto } from './database/dto/create-location.dto';

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
