import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRole } from '../../core/enum/user-role.enum';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body('email') email: string,
    @Body('password') passwordPlain: string,
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('role') role: UserRole,
    @Headers('x-user-id') creatorIdHeader?: string,
  ): Promise<User> {
    const creatorId = creatorIdHeader ? parseInt(creatorIdHeader, 10) : null;

    // Metoda create zwraca obiekt bez passwordHash, więc od razu robimy return
    return this.userService.create(
      email,
      passwordPlain,
      firstName,
      lastName,
      role,
      creatorId,
    );
  }

  @Get()
  async findAll(): Promise<User[]> {
    // Brak pętli .map() - baza danych nie zwraca haseł, lista jest bezpieczna
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findById(id);
  }

  @Patch(':id/role')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') newRole: UserRole,
    @Headers('x-user-id') changedByIdHeader: string,
  ): Promise<User> {
    const changedById = parseInt(changedByIdHeader, 10);
    return this.userService.updateRole(id, newRole, changedById);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') changedByIdHeader: string,
  ): Promise<{ message: string }> {
    const changedById = parseInt(changedByIdHeader, 10);
    await this.userService.deactivate(id, changedById);

    return {
      message:
        'Użytkownik został pomyślnie dezaktywowany, a akcja zapisana w historii.',
    };
  }
}
