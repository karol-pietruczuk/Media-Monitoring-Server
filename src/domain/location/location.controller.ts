import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { LocationService } from './location.service';
import { Location } from './entities/location.entity';
import { UserRole } from '../../core/enums/user-role.enum';
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../features/auth/guards/roles.guard';
import { Roles } from '../../features/auth/decorators/roles.decorator';
import { CreateLocationDto } from './dto/create-location.dto';
import { FindAllLocationDto } from './dto/find-all-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

// Interfejs reprezentujący otypowany obiekt użytkownika wstrzyknięty przez JwtStrategy
interface IRequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: UserRole;
  };
}

@Controller('locations')
@UseGuards(JwtAuthGuard, RolesGuard) // Każdy endpoint domyślnie wymaga zalogowania tokenem JWT
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @Roles(UserRole.Operator, UserRole.Admin)
  async create(
    @Body() dto: CreateLocationDto, // <-- Zmiana na całe DTO
    @Req() req: IRequestWithUser,
  ): Promise<Location> {
    return this.locationService.create(
      dto.mainLocation,
      dto.subLocation,
      req.user.id,
    );
  }

  @Get()
  // Brak dekoratora @Roles sprawia, że każda zalogowana osoba (w tym VIEWER) ma dostęp
  async findAll(@Query() query: FindAllLocationDto): Promise<Location[]> {
    // Przekazujemy DTO z parametrami paginacji/wyszukiwania do serwisu
    return this.locationService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Location> {
    return this.locationService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.Operator, UserRole.Admin)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLocationDto, // <-- ZMIANA: podstawiamy dedykowane Update DTO zamiast Create DTO
    @Req() req: IRequestWithUser,
  ): Promise<Location> {
    const loggedInUser = req.user;

    // Ponieważ w UpdateLocationDto pola są opcjonalne (mogą być undefined),
    // serwis powinien obsłużyć tylko te wartości, które faktycznie przyszły z frontendu.
    return this.locationService.update(
      id,
      dto.mainLocation,
      dto.subLocation ?? null,
      loggedInUser.id,
    );
  }

  @Delete(':id')
  @Roles(UserRole.Admin) // Wyłącznie główny ADMINISTRATOR może usunąć halę/lokalizację
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: IRequestWithUser,
  ): Promise<{ message: string }> {
    const loggedInUser = req.user;
    await this.locationService.remove(id, loggedInUser.id);

    return {
      message:
        'Lokalizacja została pomyślnie usunięta, a operacja została zarejestrowana w bazie danych historii.',
    };
  }
}
