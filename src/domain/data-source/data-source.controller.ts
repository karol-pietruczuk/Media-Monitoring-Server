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
import { DataSourceService } from './data-source.service';
import { CreateDataSourceDto } from './dto/create-data-source.dto';
import { UpdateDataSourceDto } from './dto/update-data-source.dto';
import { UpdateDataSourceStatusDto } from './dto/update-data-source-status.dto';
import { Roles } from '../../features/auth/decorators/roles.decorator';
import { UserRole } from '../../core/enums/user-role.enum';
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../features/auth/guards/roles.guard';

type AuthenticatedUser = { id: number; email: string; role: UserRole };

@Controller('data-sources')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DataSourceController {
  constructor(private readonly dataSourceService: DataSourceService) {}

  @Post()
  @Roles(UserRole.Admin) // Wyłącznie ADMIN może konfigurować nowe połączenia sieciowe
  async create(
    @Body() dto: CreateDataSourceDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ) {
    return this.dataSourceService.create(dto, req.user.id);
  }

  @Get()
  async findAll() {
    return this.dataSourceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dataSourceService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.Admin) // Edycja parametrów sieciowych zablokowana dla Operatora i Viewera
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDataSourceDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ) {
    return this.dataSourceService.update(id, dto, req.user.id);
  }

  @Patch(':id/status')
  @Roles(UserRole.Admin)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDataSourceStatusDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ) {
    return dto.isActive
      ? this.dataSourceService.activate(id, req.user.id)
      : this.dataSourceService.deactivate(id, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.Admin) // Czyszczenie śmieci i testów dozwolone tylko dla ADMINA
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: AuthenticatedUser },
  ) {
    await this.dataSourceService.remove(id, req.user.id);
    return {
      message:
        'Źródło danych zostało bezpowrotnie usunięte z systemu, a akcja została zarejestrowana w logu audytowym.',
    };
  }
}
