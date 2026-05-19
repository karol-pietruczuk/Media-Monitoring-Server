import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../domain/user/user.service';
import { scryptSync, timingSafeEqual } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    email: string,
    passwordPlain: string,
  ): Promise<{ accessToken: string }> {
    // Pobieramy użytkownika wraz z ukrytym w encji hashem hasła (select: false)
    const user = await this.userService.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Niepoprawny e-mail lub hasło.');
    }

    // Weryfikacja hasła skrótem kryptograficznym scrypt
    const [salt, key] = user.passwordHash.split(':');
    const hashedBuffer = scryptSync(passwordPlain, salt, 64);
    const keyBuffer = Buffer.from(key, 'hex');

    const isPasswordValid = timingSafeEqual(hashedBuffer, keyBuffer);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Niepoprawny e-mail lub hasło.');
    }

    // Dane zaszyte wewnątrz tokenu (Payload)
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
