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
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiProperty,
} from '@nestjs/swagger';
import { TotalDataService } from './total-data.service';
import { CreateTotalChannelDto } from './dto/create-total-channel.dto';
import { UpdateTotalChannelDto } from './dto/update-total-channel.dto';
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../features/auth/guards/roles.guard';
import { Roles } from '../../features/auth/decorators/roles.decorator';
import { UserRole } from '../../core/enums/user-role.enum';

type AuthenticatedUser = {
  id: number;
  email: string;
  role: UserRole;
};

// --- DTO ODPOWIEDZI DLA SWAGGERA ---
class TotalDataChannelResponseDto {
  @ApiProperty({ example: 1 }) id!: number;
  @ApiProperty({ example: { id: 3 } }) meter!: { id: number };
  @ApiProperty({ example: { id: 2 } }) dataSource!: { id: number };
  @ApiProperty({ example: '{"register": 40001, "multiplier": 0.1}' })
  dataMappingInfo!: string;
}

class ChannelMessageResponseDto {
  @ApiProperty({ example: 'Kanał danych został pomyślnie usunięty.' })
  message!: string;
}

@ApiTags('Total Data Channels')
@ApiBearerAuth()
@Controller('total-data')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TotalDataController {
  constructor(private readonly totalDataService: TotalDataService) {}

  @Post('channels')
  @Roles(UserRole.Operator, UserRole.Admin)
  @ApiOperation({
    summary: 'Utworzenie nowego kanału danych całkowitych [OPERATOR, ADMIN]',
  })
  @ApiCreatedResponse({
    description:
      'Kanał danych został pomyślnie utworzony, a zdarzenie zautoryzowane w logu audytowym.',
    type: TotalDataChannelResponseDto,
  })
  async createChannel(
    @Body() dto: CreateTotalChannelDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<TotalDataChannelResponseDto> {
    const rawChannel = await this.totalDataService.createChannel(
      dto,
      req.user.id,
    );
    return rawChannel as TotalDataChannelResponseDto;
  }

  @Get('channels/:id')
  @ApiOperation({ summary: 'Pobranie szczegółów kanału danych po ID' })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator kanału danych',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Zwraca obiekt kanału danych całkowitych wraz z relacjami.',
    type: TotalDataChannelResponseDto,
  })
  async findChannel(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TotalDataChannelResponseDto> {
    const rawChannel = await this.totalDataService.findChannelById(id);
    return rawChannel as TotalDataChannelResponseDto;
  }

  @Patch('channels/:id')
  @Roles(UserRole.Operator, UserRole.Admin)
  @ApiOperation({
    summary: 'Aktualizacja parametrów kanału danych [OPERATOR, ADMIN]',
  })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator edytowanego kanału',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Kanał danych został pomyślnie zaktualizowany.',
    type: TotalDataChannelResponseDto,
  })
  async updateChannel(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTotalChannelDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<TotalDataChannelResponseDto> {
    const rawChannel = await this.totalDataService.updateChannel(
      id,
      dto,
      req.user.id,
    );
    return rawChannel as TotalDataChannelResponseDto;
  }

  @Delete('channels/:id')
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Usunięcie kanału danych całkowitych (Hard Delete) [ADMIN]',
  })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator usuwanego kanału',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Kanał został trwale usunięty z systemu.',
    type: ChannelMessageResponseDto,
  })
  async removeChannel(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<ChannelMessageResponseDto> {
    await this.totalDataService.removeChannel(id, req.user.id);
    return {
      message:
        'Kanał danych całkowitych został pomyślnie usunięty, a operacja została zarejestrowana w logu audytowym.',
    };
  }
}
