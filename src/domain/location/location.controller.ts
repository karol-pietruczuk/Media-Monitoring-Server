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
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { LocationService } from './location.service';
import { UserRole } from '../../core/enums/user-role.enum';
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../features/auth/guards/roles.guard';
import { Roles } from '../../features/auth/decorators/roles.decorator';
import { CreateLocationDto } from './dto/create-location.dto';
import { FindAllLocationDto } from './dto/find-all-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { AuthenticatedUser } from '../../core/types/authenticated-user.type';
import { LocationResponseDto } from './dto/location-response.dto';
import { LocationMessageResponseDto } from './dto/location-message-response.dto';

@ApiTags('Locations')
@ApiBearerAuth()
@Controller('locations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @Roles(UserRole.Operator, UserRole.Admin)
  @ApiOperation({ summary: 'Utworzenie nowej lokalizacji [OPERATOR, ADMIN]' })
  @ApiCreatedResponse({
    description: 'Lokalizacja została pomyślnie zarejestrowana.',
    type: LocationResponseDto,
  })
  @Post()
  @Roles(UserRole.Operator, UserRole.Admin)
  @ApiOperation({ summary: 'Utworzenie nowej lokalizacji [OPERATOR, ADMIN]' })
  @ApiCreatedResponse({
    description: 'Lokalizacja została pomyślnie zarejestrowana.',
    type: LocationResponseDto,
  })
  async create(
    @Body() dto: CreateLocationDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<LocationResponseDto> {
    // PRZEDTEM:
    // const rawLocation = await this.locationService.create(dto.mainLocation, dto.subLocation, req.user.id);

    // POTEM (Zgodnie z nowym wzorcem dla modułów z obsługą backupu i logów):
    const rawLocation = await this.locationService.create(
      dto, // Pierwszy argument: całe DTO zawierające mainLocation i subLocation
      req.user.id, // Drugi argument: ID zalogowanego operatora dla systemu historii zmian
    );

    return rawLocation as LocationResponseDto;
  }

  @Get()
  @ApiOperation({
    summary: 'Pobranie przefiltrowanej listy lokalizacji z paginacją [WSZYSCY]',
  })
  @ApiOkResponse({
    description:
      'Zwraca przefiltrowaną listę lokalizacji na podstawie kryteriów query.',
    type: [LocationResponseDto],
  })
  async findAll(
    @Query() query: FindAllLocationDto,
  ): Promise<LocationResponseDto[]> {
    const rawLocations = await this.locationService.findAll(query);
    return rawLocations as LocationResponseDto[];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Pobranie szczegółów lokalizacji po ID [WSZYSCY]' })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator lokalizacji',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Zwraca dane wybranej lokalizacji.',
    type: LocationResponseDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LocationResponseDto> {
    const rawLocation = await this.locationService.findById(id);
    return rawLocation as LocationResponseDto;
  }

  @Patch(':id')
  @Roles(UserRole.Operator, UserRole.Admin)
  @ApiOperation({
    summary: 'Aktualizacja parametrów lokalizacji [OPERATOR, ADMIN]',
  })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator edytowanej lokalizacji',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Konfiguracja lokalizacji została pomyślnie zmodyfikowana.',
    type: LocationResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLocationDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<LocationResponseDto> {
    const rawLocation = await this.locationService.update(
      id,
      dto.mainLocation,
      dto.subLocation ?? null,
      req.user.id,
    );
    return rawLocation as LocationResponseDto;
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Trwałe usunięcie obszaru/lokalizacji z bazy [ADMIN]',
  })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator usuwanej lokalizacji',
    example: 1,
  })
  @ApiOkResponse({
    description:
      'Lokalizacja została pomyślnie usunięta, brak powiązanych kluczy obcych.',
    type: LocationMessageResponseDto,
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<LocationMessageResponseDto> {
    await this.locationService.remove(id, req.user.id);
    return {
      message:
        'Lokalizacja została pomyślnie usunięta, a operacja została zarejestrowana w bazie danych historii.',
    };
  }
}
