import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from './entities/user.entity';
import { UserRole } from '../../core/enums/user-role.enum';
import { UserUpdatedEvent } from './events/user-updated.event';
import { UserChange } from '../../core/enums/user-change.enum';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async updateSessionParams(
    userId: number,
    hashedRefreshToken: string | null,
    isLoggedIn: boolean,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      hashedRefreshToken,
      isLoggedIn,
    });
  }

  async findByIdForSession(id: number): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.hashedRefreshToken')
      .where('user.id = :id', { id })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .getOne();
  }

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

    const salt = randomBytes(16).toString('hex');
    const derivedKey = scryptSync(passwordPlain, salt, 64);
    const passwordHash = `${salt}:${derivedKey.toString('hex')}`;

    const user = this.userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      role,
    });

    const savedUser = await this.userRepository.save(user);

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

  async update(
    id: number,
    dto: UpdateUserDto,
    changedById: number,
  ): Promise<User> {
    const user = await this.findById(id);

    const oldValues = {
      email: user.email,
      role: user.role,
    };

    Object.assign(user, dto);
    const updatedUser = await this.userRepository.save(user);

    this.eventEmitter.emit(
      'user.updated',
      new UserUpdatedEvent(id, changedById, UserChange.UpdatedUser, oldValues, {
        email: updatedUser.email,
        role: updatedUser.role,
      }),
    );

    return updatedUser;
  }

  async changePassword(
    id: number,
    oldPassword: string,
    newPassword: string,
    changedById: number,
    requesterId: number,
    requesterRole: UserRole,
  ): Promise<void> {
    const user = await this.findById(id);

    const isSelfUpdate = requesterId === id;
    if (isSelfUpdate) {
      const parts = user.passwordHash.split(':');
      if (parts.length !== 2)
        throw new Error('Nieprawidłowy format hash hasła.');

      const [salt, key] = parts;
      const hashedBuffer = scryptSync(oldPassword, salt, 64);
      const keyBuffer = Buffer.from(key, 'hex');

      if (!timingSafeEqual(hashedBuffer, keyBuffer)) {
        throw new UnauthorizedException('Niepoprawne aktualne hasło.');
      }
    } else if (requesterRole !== UserRole.Admin) {
      throw new UnauthorizedException(
        'Nie masz uprawnień do zmiany hasła innego użytkownika.',
      );
    }

    const salt = randomBytes(16).toString('hex');
    const derivedKey = scryptSync(newPassword, salt, 64);
    user.passwordHash = `${salt}:${derivedKey.toString('hex')}`;

    await this.userRepository.save(user);

    this.eventEmitter.emit(
      'user.updated',
      new UserUpdatedEvent(
        user.id,
        changedById,
        UserChange.UpdatedUser,
        { passwordChanged: isSelfUpdate },
        { passwordChanged: true },
      ),
    );
  }

  async resetPassword(
    id: number,
    newPassword: string,
    changedById: number,
  ): Promise<void> {
    const user = await this.findById(id);

    const salt = randomBytes(16).toString('hex');
    const derivedKey = scryptSync(newPassword, salt, 64);
    user.passwordHash = `${salt}:${derivedKey.toString('hex')}`;

    await this.userRepository.save(user);

    this.eventEmitter.emit(
      'user.updated',
      new UserUpdatedEvent(
        user.id,
        changedById,
        UserChange.UpdatedUser,
        { passwordReset: true },
        { passwordReset: true },
      ),
    );
  }

  async deactivate(id: number, changedById: number): Promise<void> {
    const user = await this.findById(id);

    user.isActive = false;
    await this.userRepository.save(user);

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

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .getOne();
  }
}
