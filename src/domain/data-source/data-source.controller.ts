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
  ParseBoolPipe,
} from '@nestjs/common';
import { DataSourceService } from './data-source.service';
import { CreateDataSourceDto } from './dto/create-data-source.dto';
import { Roles } from '../../features/auth/decorators/roles.decorator';
import { UserRole } from '../../core/enums/user-role.enum';
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../features/auth/guards/roles.guard';

interface IRequestWithUser extends Request {
  user: { id: number; email: string; role: UserRole };
}

@Controller('data-sources')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DataSourceController {
  constructor(private readonly dataSourceService: DataSourceService) {}

  @Post()
  @Roles(UserRole.Admin) // Wyłącznie ADMIN może konfigurować nowe połączenia sieciowe
  async create(@Body() dto: CreateDataSourceDto, @Req() req: IRequestWithUser) {
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
    @Body() dto: CreateDataSourceDto,
    @Req() req: IRequestWithUser,
  ) {
    return this.dataSourceService.update(id, dto, req.user.id);
  }

  // src/domain/data-source/data-source.controller.ts

  //   @Patch(':id/deactivate')
  //   @Roles(UserRole.Admin) // Tylko administrator decyduje o wyłączeniu komunikacji
  //   async deactivate(
  //     @Param('id', ParseIntPipe) id: number,
  //     @Req() req: IRequestWithUser,
  //   ) {
  //     return this.dataSourceService.deactivate(id, req.user.id);
  //   }

  //   @Patch(':id/activate')
  //   @Roles(UserRole.Admin) // Tylko administrator może ponownie uruchomić proces komunikacji sieciowej
  //   async activate(
  //     @Param('id', ParseIntPipe) id: number,
  //     @Req() req: IRequestWithUser,
  //   ) {
  //     return this.dataSourceService.activate(id, req.user.id);
  //   }

  @Patch(':id/status')
  @Roles(UserRole.Admin)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive', ParseBoolPipe) isActive: boolean, // ParseBoolPipe automatycznie dba o walidację typu boolean
    @Req() req: IRequestWithUser,
  ) {
    return isActive
      ? this.dataSourceService.activate(id, req.user.id)
      : this.dataSourceService.deactivate(id, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.Admin) // Czyszczenie śmieci i testów dozwolone tylko dla ADMINA
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: IRequestWithUser,
  ) {
    await this.dataSourceService.remove(id, req.user.id);
    return {
      message:
        'Źródło danych zostało bezpowrotnie usunięte z systemu, a akcja została zarejestrowana w logu audytowym.',
    };
  }
}
