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
  ForbiddenException,
  Query,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserRole } from '../../core/enums/user-role.enum';
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../features/auth/guards/roles.guard';
import { Roles } from '../../features/auth/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { ResetUserPasswordDto } from './dto/reset-user-password.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserMessageResponseDto } from './dto/user-message-response.dto';
import { UserHistoryResponseDto } from './dto/user-history-response.dto';
import { UserMetricsResponseDto } from './dto/user-metrics-response.dto';
import { AuthenticatedUser } from '../../core/types/authenticated-user.type';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Utworzenie nowego użytkownika [ADMIN]' })
  @ApiCreatedResponse({
    description:
      'Użytkownik został pomyślnie utworzony, a zdarzenie zapisane w systemie audytowym.',
    type: UserResponseDto,
  })
  async create(
    @Body() dto: CreateUserDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<UserResponseDto> {
    return this.userService.create(
      dto.email,
      dto.password,
      dto.firstName,
      dto.lastName,
      dto.role,
      req.user?.id ?? null,
    );
  }

  @Get()
  @ApiOperation({
    summary:
      'Pobranie listy wszystkich użytkowników z opcją filtrowania nieaktywnych',
  })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
    description:
      'Czy lista ma zawierać również nieaktywnych użytkowników (Działa tylko dla Admina)',
  })
  @ApiOkResponse({
    description: 'Zwraca tablicę z danymi użytkowników.',
    type: [UserResponseDto],
  })
  async findAll(
    @Query('includeInactive') includeInactive?: string,
    @Req() req?: Request & { user: AuthenticatedUser }, // <-- NAPRAWIONE: Zastąpiono 'any' poprawnym typem
  ): Promise<UserResponseDto[]> {
    const showAll =
      includeInactive === 'true' && req?.user?.role === UserRole.Admin;
    return this.userService.findAll(showAll);
  }

  @Get('metrics/summary')
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Pobranie statystyk liczbowych użytkowników systemu [ADMIN]',
  })
  @ApiOkResponse({
    description: 'Zwraca statystyki kont (total, active, inactive, online).',
    type: UserMetricsResponseDto,
  })
  async getMetrics(): Promise<UserMetricsResponseDto> {
    return this.userService.getMetrics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Pobranie szczegółów jednego użytkownika po ID' })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator użytkownika w bazie',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Znaleziono użytkownika o podanym ID.',
    type: UserResponseDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<UserResponseDto> {
    if (
      req.user.role !== UserRole.Admin &&
      req.user.role !== UserRole.Operator &&
      req.user.id !== id
    ) {
      throw new ForbiddenException(
        'Nie masz uprawnień do przeglądania profilu tego użytkownika.',
      );
    }
    return this.userService.findById(id);
  }

  @Get(':id/history')
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary:
      'Pobranie pełnej historii zmian (Audit Log) wybranego użytkownika [ADMIN]',
  })
  @ApiParam({
    name: 'id',
    description: 'ID użytkownika, którego historię sprawdzamy',
    example: 1,
  })
  @ApiOkResponse({
    description:
      'Zwraca listę historycznych zmian powiązanych z użytkownikiem.',
    type: [UserHistoryResponseDto],
  })
  async getHistory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserHistoryResponseDto[]> {
    const rawHistory = await this.userService.getHistory(id);
    // <-- NAPRAWIONE: Jawne rzutowanie typu z 'any[]' eliminuje błąd lintera 'no-unsafe-return'
    return rawHistory as UserHistoryResponseDto[];
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Aktualizacja podstawowych danych (Własne dane lub wyższe role)',
  })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator edytowanego użytkownika',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Dane użytkownika zostały pomyślnie zmodyfikowane.',
    type: UserResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<UserResponseDto> {
    if (
      req.user.role !== UserRole.Admin &&
      req.user.role !== UserRole.Operator &&
      req.user.id !== id
    ) {
      throw new ForbiddenException('Możesz edytować tylko swoje dane.');
    }

    if (req.user.role === UserRole.Operator) {
      const targetUser = await this.userService.findById(id);
      if (targetUser.role === UserRole.Admin && req.user.id !== id) {
        throw new ForbiddenException(
          'Operator nie może modyfikować danych administratora.',
        );
      }
    }

    return this.userService.update(id, dto, req.user.id);
  }

  @Patch(':id/role')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Zmiana roli użytkownika [ADMIN]' })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator użytkownika, któremu zmieniamy rolę',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Rola użytkownika została pomyślnie zaktualizowana.',
    type: UserResponseDto,
  })
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<UserResponseDto> {
    return this.userService.updateRole(id, dto.role, req.user.id);
  }

  @Patch(':id/password')
  @ApiOperation({
    summary: 'Zmiana własnego hasła przez zalogowanego użytkownika',
  })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator Twojego konta',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Twoje hasło zostało pomyślnie zmienione.',
    type: UserMessageResponseDto,
  })
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserPasswordDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<UserMessageResponseDto> {
    if (req.user.id !== id && req.user.role !== UserRole.Admin) {
      throw new ForbiddenException(
        'Nie masz uprawnień do zmiany hasła innego użytkownika.',
      );
    }

    await this.userService.changePassword(
      id,
      dto.oldPassword,
      dto.newPassword,
      req.user.id,
      req.user.id,
      req.user.role,
    );

    return { message: 'Hasło zostało pomyślnie zmienione.' };
  }

  @Patch(':id/password/reset')
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Wymuszony reset hasła użytkownika przez administratora [ADMIN]',
  })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator użytkownika, którego hasło jest resetowane',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Hasło użytkownika zostało pomyślnie zresetowane.',
    type: UserMessageResponseDto,
  })
  async resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResetUserPasswordDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<UserMessageResponseDto> {
    await this.userService.resetPassword(id, dto.newPassword, req.user.id);

    return { message: 'Hasło użytkownika zostało pomyślnie zresetowane.' };
  }

  @Patch(':id/activate')
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Aktywacja konta zablokowanego/zdezaktywowanego [ADMIN]',
  })
  @ApiParam({
    name: 'id',
    description: 'ID użytkownika do przywrócenia',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Użytkownik został pomyślnie aktywowany.',
    type: UserResponseDto,
  })
  async activate(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<UserResponseDto> {
    return this.userService.activate(id, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Dezaktywacja użytkownika (Soft Delete) [ADMIN]' })
  @ApiParam({
    name: 'id',
    description: 'Identyfikator użytkownika do dezaktywacji',
    example: 1,
  })
  @ApiOkResponse({
    description:
      'Użytkownik został pomyślnie zdezaktywowany (ustawiono isActive = 0).',
    type: UserMessageResponseDto,
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<UserMessageResponseDto> {
    await this.userService.deactivate(id, req.user.id);

    return {
      message:
        'Użytkownik został pomyślnie dezaktywowany, a akcja zapisana w historii.',
    };
  }
}
