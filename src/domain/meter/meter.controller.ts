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
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { MeterService } from './meter.service';
import { CreateMeterDto } from './dto/create-meter.dto';
import { UpdateMeterDto } from './dto/update-meter.dto';
import { CreateCalibrationDto } from './dto/create-calibration.dto';
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../features/auth/guards/roles.guard';
import { Roles } from '../../features/auth/decorators/roles.decorator';
import { UserRole } from '../../core/enums/user-role.enum';
import { AuthenticatedUser } from '../../core/types/authenticated-user.type';
import { MeterResponseDto } from './dto/meter-response.dto';
import { MeterMessageResponseDto } from './dto/meter-message-response.dto';
import { CalibrationResponseDto } from './dto/meter-calibration-response.dto';
import { UpdateMeterStatusDto } from './dto/update-meter-status.dto';

@ApiTags('Meters')
@ApiBearerAuth()
@Controller('meters')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MeterController {
  constructor(private readonly meterService: MeterService) {}

  @Post()
  @Roles(UserRole.Operator, UserRole.Admin)
  @ApiOperation({
    summary: 'Utworzenie nowego licznika pomiarowego [OPERATOR, ADMIN]',
  })
  @ApiCreatedResponse({
    description: 'Licznik został pomyślnie zarejestrowany w systemie.',
    type: MeterResponseDto,
  })
  async create(
    @Body() dto: CreateMeterDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<MeterResponseDto> {
    const rawMeter = await this.meterService.create(dto, req.user.id);
    return rawMeter as MeterResponseDto;
  }

  @Get()
  @ApiOperation({
    summary: 'Pobranie listy wszystkich liczników wraz z relacjami',
  })
  @ApiOkResponse({
    description: 'Zwraca tablicę obiektów reprezentujących liczniki.',
    type: [MeterResponseDto],
  })
  async findAll(): Promise<MeterResponseDto[]> {
    const rawMeters = await this.meterService.findAll();
    return rawMeters as MeterResponseDto[];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Pobranie szczegółowych danych jednego licznika' })
  @ApiParam({ name: 'id', description: 'Identyfikator licznika', example: 1 })
  @ApiOkResponse({
    description: 'Znaleziono licznik o podanym identyfikatorze.',
    type: MeterResponseDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MeterResponseDto> {
    const rawMeter = await this.meterService.findById(id);
    return rawMeter as MeterResponseDto;
  }

  @Patch(':id')
  @Roles(UserRole.Operator, UserRole.Admin)
  @ApiOperation({
    summary:
      'Aktualizacja parametrów strukturalnych licznika [OPERATOR, ADMIN]',
  })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator edytowanego licznika',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Dane konfiguracji licznika zostały pomyślnie zaktualizowane.',
    type: MeterResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMeterDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<MeterResponseDto> {
    const rawMeter = await this.meterService.update(id, dto, req.user.id);
    return rawMeter as MeterResponseDto;
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Trwałe usunięcie licznika z systemu [ADMIN]' })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator usuwanego licznika',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Licznik został pomyślnie usunięty z bazy danych.',
    type: MeterMessageResponseDto,
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<MeterMessageResponseDto> {
    await this.meterService.remove(id, req.user.id);
    return {
      message:
        'Licznik został trwale skasowany, akcja zachowana w logu audytowym.',
    };
  }

  @Post('calibrations')
  @Roles(UserRole.Operator, UserRole.Admin)
  @ApiOperation({
    summary:
      'Wprowadzenie nowego punktu kalibracyjnego / odczytu kontrolnego licznika [OPERATOR, ADMIN]',
  })
  @ApiCreatedResponse({
    description: 'Punkt kalibracyjny został pomyślnie zarejestrowany.',
    type: CalibrationResponseDto,
  })
  async addCalibration(
    @Body() dto: CreateCalibrationDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<CalibrationResponseDto> {
    const rawCalibration = await this.meterService.addCalibration(
      dto,
      req.user.id,
    );
    return rawCalibration as CalibrationResponseDto;
  }

  @Patch(':id/status/total-data')
  @Roles(UserRole.Operator, UserRole.Admin)
  @ApiOperation({
    summary: 'Włącz/Wyłącz pobieranie danych TotalData dla licznika',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: MeterResponseDto })
  async toggleTotalData(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMeterStatusDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<MeterResponseDto> {
    const rawMeter = await this.meterService.toggleTotalData(
      id,
      dto.isActive,
      req.user.id,
    );
    return rawMeter as MeterResponseDto;
  }

  @Patch(':id/status/pulse-data')
  @Roles(UserRole.Operator, UserRole.Admin)
  @ApiOperation({
    summary: 'Włącz/Wyłącz pobieranie danych PulseData dla licznika',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: MeterResponseDto })
  async togglePulseData(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMeterStatusDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<MeterResponseDto> {
    const rawMeter = await this.meterService.togglePulseData(
      id,
      dto.isActive,
      req.user.id,
    );
    return rawMeter as MeterResponseDto;
  }
}
