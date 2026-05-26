import type { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { DataSourceService } from './data-source.service';
import { CreateDataSourceDto } from './dto/create-data-source.dto';
import { UpdateDataSourceDto } from './dto/update-data-source.dto';
import { UpdateDataSourceStatusDto } from './dto/update-data-source-status.dto';
import { Roles } from '../../features/auth/decorators/roles.decorator';
import { UserRole } from '../../core/enums/user-role.enum';
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../features/auth/guards/roles.guard';
import { AuthenticatedUser } from '../../core/types/authenticated-user.type';
import { DataSourceResponseDto } from './dto/data-source-response.dto';
import { DataSourceMessageResponseDto } from './dto/data-source-message-response.dto';

@ApiTags('Data Sources')
@ApiBearerAuth()
@Controller('data-sources')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DataSourceController {
  constructor(private readonly dataSourceService: DataSourceService) {}

  @Post()
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Utworzenie nowego źródła danych sieciowych / protokołu [ADMIN]',
  })
  @ApiCreatedResponse({
    description:
      'Połączenie ze źródłem danych zostało pomyślnie skonfigurowane.',
    type: DataSourceResponseDto,
  })
  async create(
    @Body() dto: CreateDataSourceDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<DataSourceResponseDto> {
    const rawSource = await this.dataSourceService.create(dto, req.user.id);
    return rawSource as DataSourceResponseDto;
  }

  @Get()
  @ApiOperation({
    summary:
      'Pobranie listy wszystkich zarejestrowanych źródeł danych [WSZYSCY]',
  })
  @ApiOkResponse({
    description: 'Zwraca tablicę obiektów reprezentujących źródła danych.',
    type: [DataSourceResponseDto],
  })
  async findAll(): Promise<DataSourceResponseDto[]> {
    const rawSources = await this.dataSourceService.findAll();
    return rawSources as DataSourceResponseDto[];
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Pobranie parametrów konkretnego źródła danych po ID [WSZYSCY]',
  })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator źródła danych',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Zwraca dane wybranego źródła połączenia.',
    type: DataSourceResponseDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DataSourceResponseDto> {
    const rawSource = await this.dataSourceService.findById(id);
    return rawSource as DataSourceResponseDto;
  }

  @Patch(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Aktualizacja parametrów sieciowych źródła danych [ADMIN]',
  })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator edytowanego źródła danych',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Konfiguracja połączenia została pomyślnie zmodyfikowana.',
    type: DataSourceResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDataSourceDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<DataSourceResponseDto> {
    const rawSource = await this.dataSourceService.update(id, dto, req.user.id);
    return rawSource as DataSourceResponseDto;
  }

  @Patch(':id/status')
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Aktywacja lub dezaktywacja komunikacji ze źródłem danych [ADMIN]',
  })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator źródła danych',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Stan aktywności źródła danych został pomyślnie zmieniony.',
    type: DataSourceResponseDto,
  })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDataSourceStatusDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<DataSourceResponseDto> {
    const rawSource = dto.isActive
      ? await this.dataSourceService.activate(id, req.user.id)
      : await this.dataSourceService.deactivate(id, req.user.id);
    return rawSource as DataSourceResponseDto;
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Bezpowrotne usunięcie źródła danych (Hard Delete) [ADMIN]',
  })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator usuwanego źródła danych',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Źródło danych zostało pomyślnie usunięte z systemu.',
    type: DataSourceMessageResponseDto,
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<DataSourceMessageResponseDto> {
    await this.dataSourceService.remove(id, req.user.id);
    return {
      message:
        'Źródło danych zostało bezpowrotnie usunięte z systemu, a akcja została zarejestrowana w logu audytowym.',
    };
  }
}
