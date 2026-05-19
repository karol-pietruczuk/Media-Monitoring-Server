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
} from '@nestjs/common';
import { LocationService } from './location.service';
import { Location } from './entities/location.entity';
import { UserRole } from '../../core/enums/user-role.enum';
import { JwtAuthGuard } from '../../feature/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../feature/auth/guards/roles.guard';
import { Roles } from '../../feature/auth/decorators/roles.decorator';

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
  @Roles(UserRole.Operator, UserRole.Admin) // Tylko OPERATOR i ADMIN mogą tworzyć lokalizacje
  async create(
    @Body('mainLocation') mainLocation: string,
    @Body('subLocation') subLocation: string | null,
    @Req() req: IRequestWithUser,
  ): Promise<Location> {
    const loggedInUser = req.user;
    return this.locationService.create(
      mainLocation,
      subLocation,
      loggedInUser.id,
    );
  }

  @Get()
  // Brak dekoratora @Roles sprawia, że każda zalogowana osoba (w tym VIEWER) ma dostęp
  async findAll(): Promise<Location[]> {
    return this.locationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Location> {
    return this.locationService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.Operator, UserRole.Admin) // Modyfikacja zarezerwowana dla OPERATORA i ADMINA
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body('mainLocation') mainLocation: string,
    @Body('subLocation') subLocation: string | null,
    @Req() req: IRequestWithUser,
  ): Promise<Location> {
    const loggedInUser = req.user;
    return this.locationService.update(
      id,
      mainLocation,
      subLocation,
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
