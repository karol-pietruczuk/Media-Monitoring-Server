import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Headers,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { Location } from './entities/location.entity';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  async create(
    @Body('mainLocation') mainLocation: string,
    @Body('subLocation') subLocation: string | null,
    @Headers('x-user-id') creatorIdHeader?: string, // Tymczasowe pobieranie ID wykonawcy przed wdrożeniem JWT
  ): Promise<Location> {
    const creatorId = creatorIdHeader ? parseInt(creatorIdHeader, 10) : null;
    return this.locationService.create(mainLocation, subLocation, creatorId);
  }

  @Get()
  async findAll(): Promise<Location[]> {
    return this.locationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Location> {
    return this.locationService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body('mainLocation') mainLocation: string,
    @Body('subLocation') subLocation: string | null,
    @Headers('x-user-id') changedByIdHeader: string, // Wymagane przekazanie ID w nagłówku do celów testowych
  ): Promise<Location> {
    const changedById = parseInt(changedByIdHeader, 10);
    return this.locationService.update(
      id,
      mainLocation,
      subLocation,
      changedById,
    );
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') changedByIdHeader: string,
  ): Promise<{ message: string }> {
    const changedById = parseInt(changedByIdHeader, 10);
    await this.locationService.remove(id, changedById);

    return {
      message:
        'Lokalizacja została pomyślnie usunięta, a operacja została zarejestrowana w bazie danych historii.',
    };
  }
}
