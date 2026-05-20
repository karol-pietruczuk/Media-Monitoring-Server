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
} from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './user.service';
import { UserRole } from '../../core/enums/user-role.enum';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../features/auth/guards/roles.guard';
import { Roles } from '../../features/auth/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { ResetUserPasswordDto } from './dto/reset-user-password.dto';

type AuthenticatedUser = {
  id: number;
  email: string;
  role: UserRole;
};

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.Admin)
  create(
    @Body() dto: CreateUserDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<User> {
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
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.Operator, UserRole.Admin)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<User> {
    return this.userService.update(id, dto, req.user.id);
  }

  @Patch(':id/role')
  @Roles(UserRole.Admin)
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<User> {
    return this.userService.updateRole(id, dto.role, req.user.id);
  }

  @Patch(':id/password')
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserPasswordDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<{ message: string }> {
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

    return {
      message: 'Hasło zostało pomyślnie zmienione.',
    };
  }

  @Patch(':id/password/reset')
  @Roles(UserRole.Admin)
  async resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResetUserPasswordDto,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<{ message: string }> {
    await this.userService.resetPassword(id, dto.newPassword, req.user.id);

    return {
      message: 'Hasło użytkownika zostało pomyślnie zresetowane.',
    };
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: AuthenticatedUser },
  ): Promise<{ message: string }> {
    await this.userService.deactivate(id, req.user.id);

    return {
      message:
        'Użytkownik został pomyślnie dezaktywowany, a akcja zapisana w historii.',
    };
  }
}
