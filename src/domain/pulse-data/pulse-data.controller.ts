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
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PulseDataService } from './pulse-data.service';
import { CreatePulseChannelDto } from './dto/create-pulse-channel.dto';
import { UpdatePulseChannelDto } from './dto/update-pulse-channel.dto';
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../features/auth/guards/roles.guard';
import { Roles } from '../../features/auth/decorators/roles.decorator';
import { UserRole } from '../../core/enums/user-role.enum';
import { AuthenticatedUser } from '../../core/types/authenticated-user.type';
import { PulseChannelResponseDto } from './dto/pulse-channel-response.dto';
import { PulseChannelMessageResponseDto } from './dto/pulse-channel-message-response.dto';

@ApiTags('Pulse Data Channels')
@ApiBearerAuth()
@Controller('pulse-data')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PulseDataController {
  constructor(private readonly pulseDataService: PulseDataService) {}

  @Post('channels')
  @Roles(UserRole.Operator, UserRole.Admin)
  @ApiOperation({
    summary: 'Utworzenie nowego kanału impulsowego [OPERATOR, ADMIN]',
  })
  @ApiCreatedResponse({
    description:
      'Kanał impulsowy został pomyślnie utworzony, a zdarzenie zarejestrowane w logu audytowym.',
    type: PulseChannelResponseDto,
  })
  async createChannel(
    @Body() dto: CreatePulseChannelDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<PulseChannelResponseDto> {
    const rawChannel = await this.pulseDataService.createChannel(
      dto,
      req.user.id,
    );
    return rawChannel as PulseChannelResponseDto;
  }

  @Get('channels/:id')
  @ApiOperation({ summary: 'Pobranie szczegółów kanału impulsowego po ID' })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator kanału impulsowego',
    example: 1,
  })
  @ApiOkResponse({
    description:
      'Zwraca obiekt kanału impulsowego wraz z powiązanymi relacjami.',
    type: PulseChannelResponseDto,
  })
  async findChannel(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PulseChannelResponseDto> {
    const rawChannel = await this.pulseDataService.findChannelById(id);
    return rawChannel as PulseChannelResponseDto;
  }

  @Patch('channels/:id')
  @Roles(UserRole.Operator, UserRole.Admin)
  @ApiOperation({
    summary: 'Aktualizacja parametrów kanału impulsowego [OPERATOR, ADMIN]',
  })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator edytowanego kanału',
    example: 1,
  })
  @ApiOkResponse({
    description:
      'Parametry kanału impulsowego zostały pomyślnie zmodyfikowane.',
    type: PulseChannelResponseDto,
  })
  async updateChannel(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePulseChannelDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<PulseChannelResponseDto> {
    const rawChannel = await this.pulseDataService.updateChannel(
      id,
      dto,
      req.user.id,
    );
    return rawChannel as PulseChannelResponseDto;
  }

  @Delete('channels/:id')
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Usunięcie kanału impulsowego (Hard Delete) [ADMIN]',
  })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator usuwanego kanału impulsowego',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Kanał impulsowy został trwale usunięty z bazy danych.',
    type: PulseChannelMessageResponseDto,
  })
  async removeChannel(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<PulseChannelMessageResponseDto> {
    await this.pulseDataService.removeChannel(id, req.user.id);
    return {
      message:
        'Kanał impulsowy został pomyślnie usunięty, a operacja została zarejestrowana w logu audytowym.',
    };
  }
}
