import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../domain/user/user.service';
import { scryptSync, timingSafeEqual, createHash } from 'crypto';
import { UserRole } from '../../core/enums/user-role.enum';

interface ITokenPayload {
  sub: number;
  email: string;
  role: UserRole;
  type?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private generateTokens(payload: {
    sub: number;
    email: string;
    role: UserRole;
  }) {
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(
        { ...payload, type: 'refresh' },
        { expiresIn: '7d' },
      ),
    };
  }

  private hashData(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  async login(
    email: string,
    passwordPlain: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Niepoprawny e-mail lub hasło.');
    }

    const parts = user.passwordHash.split(':');
    if (parts.length !== 2) {
      throw new UnauthorizedException('Niepoprawny e-mail lub hasło.');
    }

    const [salt, key] = parts;
    const isPasswordValid = timingSafeEqual(
      scryptSync(passwordPlain, salt, 64),
      Buffer.from(key, 'hex'),
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Niepoprawny e-mail lub hasło.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = this.generateTokens(payload);
    const hashedRt = this.hashData(tokens.refreshToken);

    await this.userService.updateSessionParams(user.id, hashedRt, true);

    return tokens;
  }

  async logout(userId: number): Promise<void> {
    await this.userService.updateSessionParams(userId, null, false);
  }

  async refreshTokens(
    oldRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = this.jwtService.verify<ITokenPayload>(oldRefreshToken);

      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException('Nieprawidłowy typ tokena.');
      }

      const user = await this.userService.findByIdForSession(decoded.sub);
      if (!user || !user.hashedRefreshToken || !user.isLoggedIn) {
        throw new UnauthorizedException(
          'Sesja wygasła lub została unieważniona.',
        );
      }

      const isRefreshTokenMatching =
        this.hashData(oldRefreshToken) === user.hashedRefreshToken;
      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Niewłaściwy token uwierzytelniający.');
      }

      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const tokens = this.generateTokens(payload);
      const hashedRt = this.hashData(tokens.refreshToken);

      await this.userService.updateSessionParams(user.id, hashedRt, true);

      return tokens;
    } catch {
      throw new UnauthorizedException(
        'Token odświeżania jest nieważny lub wygasł. Zaloguj się ponownie.',
      );
    }
  }
}
