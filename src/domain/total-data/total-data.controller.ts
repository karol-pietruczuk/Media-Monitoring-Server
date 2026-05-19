import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { TotalDataService } from './total-data.service';
import { CreateTotalChannelDto } from './dto/create-total-channel.dto';
import { UpdateTotalChannelDto } from './dto/update-total-channel.dto';
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../features/auth/guards/roles.guard';
import { Roles } from '../../features/auth/decorators/roles.decorator';
import { Request } from 'express';
import { UserRole } from '../../core/enums/user-role.enum';

interface IRequestWithUser extends Request {
  user: { id: number; email: string; role: UserRole };
}

@Controller('total-data')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TotalDataController {
  constructor(private readonly totalDataService: TotalDataService) {}

  @Post('channels')
  @Roles(UserRole.Operator, UserRole.Admin)
  async createChannel(
    @Body() dto: CreateTotalChannelDto,
    @Req() req: IRequestWithUser,
  ) {
    return await this.totalDataService.createChannel(dto, req.user.id);
  }

  @Get('channels/:id')
  async findChannel(@Param('id', ParseIntPipe) id: number) {
    return await this.totalDataService.findChannelById(id);
  }

  @Patch('channels/:id')
  @Roles(UserRole.Operator, UserRole.Admin)
  async updateChannel(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTotalChannelDto,
    @Req() req: IRequestWithUser,
  ) {
    return await this.totalDataService.updateChannel(id, dto, req.user.id);
  }

  @Delete('channels/:id')
  @Roles(UserRole.Admin)
  async removeChannel(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: IRequestWithUser,
  ): Promise<{ message: string }> {
    await this.totalDataService.removeChannel(id, req.user.id);
    return {
      message:
        'Kanał danych całkowitych został pomyślnie usunięty, a operacja została zarejestrowana w logu audytowym.',
    };
  }
}
