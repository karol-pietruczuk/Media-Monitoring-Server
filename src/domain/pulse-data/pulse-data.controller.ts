import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  Get,
  Delete,
} from '@nestjs/common';
import { PulseDataService } from './pulse-data.service';
import { CreatePulseChannelDto } from './dto/create-pulse-channel.dto';
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../features/auth/guards/roles.guard';
import { Roles } from '../../features/auth/decorators/roles.decorator';
import { Request } from 'express';
import { UserRole } from '../../core/enums/user-role.enum';
import { UpdatePulseChannelDto } from './dto/update-pulse-channel.dto';

interface IRequestWithUser extends Request {
  user: { id: number; email: string; role: UserRole };
}

@Controller('pulse-data')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PulseDataController {
  constructor(private readonly pulseDataService: PulseDataService) {}

  @Post('channels')
  @Roles(UserRole.Operator, UserRole.Admin)
  async createChannel(
    @Body() dto: CreatePulseChannelDto,
    @Req() req: IRequestWithUser,
  ) {
    return this.pulseDataService.createChannel(dto, req.user.id);
  }

  @Get('channels/:id')
  async findChannel(@Param('id', ParseIntPipe) id: number) {
    return this.pulseDataService.findChannelById(id);
  }

  @Patch('channels/:id')
  @Roles(UserRole.Operator, UserRole.Admin)
  async updateChannel(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePulseChannelDto, // Zmiana na dedykowane Update DTO
    @Req() req: IRequestWithUser,
  ) {
    return this.pulseDataService.updateChannel(id, dto, req.user.id);
  }

  @Delete('channels/:id')
  @Roles(UserRole.Admin) // Tylko administrator ma prawo niszczyć konfigurację kanałów pomiarowych
  async removeChannel(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: IRequestWithUser,
  ): Promise<{ message: string }> {
    await this.pulseDataService.removeChannel(id, req.user.id);
    return {
      message:
        'Kanał impulsowy został pomyślnie usunięty, a operacja została zarejestrowana w logu audytowym.',
    };
  }
}
