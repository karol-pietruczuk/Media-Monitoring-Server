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
import { MeterService } from './meter.service';
import { CreateMeterDto } from './dto/create-meter.dto';
import { UpdateMeterDto } from './dto/update-meter.dto';
import { CreateCalibrationDto } from './dto/create-calibration.dto';
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../features/auth/guards/roles.guard';
import { Roles } from '../../features/auth/decorators/roles.decorator';
import { Request } from 'express';
import { UserRole } from '../../core/enums/user-role.enum';

interface IRequestWithUser extends Request {
  user: { id: number; email: string; role: UserRole };
}

@Controller('meters')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MeterController {
  constructor(private readonly meterService: MeterService) {}

  @Post()
  @Roles(UserRole.Operator, UserRole.Admin)
  async create(@Body() dto: CreateMeterDto, @Req() req: IRequestWithUser) {
    return this.meterService.create(dto, req.user.id);
  }

  @Get()
  async findAll() {
    return this.meterService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.meterService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.Operator, UserRole.Admin)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMeterDto,
    @Req() req: IRequestWithUser,
  ) {
    return this.meterService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.Admin) // Tylko główny ADMIN może całkowicie wykasować licznik pomiarowy
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: IRequestWithUser,
  ) {
    await this.meterService.remove(id, req.user.id);
    return {
      message:
        'Licznik został trwale skasowany, akcja zachowana w logu audytowym.',
    };
  }

  @Post('calibrations')
  @Roles(UserRole.Operator, UserRole.Admin)
  async addCalibration(
    @Body() dto: CreateCalibrationDto,
    @Req() req: IRequestWithUser,
  ) {
    return this.meterService.addCalibration(dto, req.user.id);
  }
}
