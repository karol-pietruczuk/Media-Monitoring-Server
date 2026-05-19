import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from './entities/user.entity';
import { UserRole } from '../../core/enums/user-role.enum';
import { UserUpdatedEvent } from './events/user-updated.event';
import { UserChange } from '../../core/enums/user-change.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    email: string,
    passwordPlain: string,
    firstName: string,
    lastName: string,
    role: UserRole,
    creatorId: number | null,
  ): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException(
        `Użytkownik o adresie email ${email} już istnieje.`,
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordPlain, salt);

    const user = this.userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      role,
    });

    const savedUser = await this.userRepository.save(user);

    // Emitujemy zdarzenie utworzenia użytkownika
    this.eventEmitter.emit(
      'user.updated',
      new UserUpdatedEvent(
        savedUser.id,
        creatorId,
        UserChange.CreatedUser,
        {},
        { email, firstName, lastName, role },
      ),
    );

    return savedUser;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
    });
    if (!user) {
      throw new NotFoundException(
        `Użytkownik o ID ${id} nie został znaleziony.`,
      );
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email, isActive: true } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ where: { isActive: true } });
  }

  async updateRole(
    id: number,
    newRole: UserRole,
    changedById: number,
  ): Promise<User> {
    const user = await this.findById(id);
    const oldRole = user.role;

    if (oldRole === newRole) {
      return user;
    }

    user.role = newRole;
    const updatedUser = await this.userRepository.save(user);

    // Emitujemy zdarzenie zmiany roli
    this.eventEmitter.emit(
      'user.updated',
      new UserUpdatedEvent(
        user.id,
        changedById,
        UserChange.UpdatedUser,
        { role: oldRole },
        { role: newRole },
      ),
    );

    return updatedUser;
  }

  async deactivate(id: number, changedById: number): Promise<void> {
    const user = await this.findById(id);

    user.isActive = false;
    await this.userRepository.save(user);

    // Emitujemy zdarzenie dezaktywacji (soft-delete)
    this.eventEmitter.emit(
      'user.updated',
      new UserUpdatedEvent(
        user.id,
        changedById,
        UserChange.DeactivatedUser,
        { isActive: true },
        { isActive: false },
      ),
    );
  }

  /**
   * Metoda stworzona specjalnie dla modułu Auth.
   * Jawnie wyciąga passwordHash z bazy danych MSSQL.
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash') // WYMUSZAMY pobranie ukrytego pola
      .where('user.email = :email', { email })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .getOne();
  }
}
