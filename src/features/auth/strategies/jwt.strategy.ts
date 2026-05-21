import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../../../core/enums/user-role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Klucz pobierany bezpiecznie ze zmiennych środowiskowych .env
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'DOMYSLNY_KLUCZ_TESTOWY',
    });
  }

  // To, co zwróci ta metoda, NestJS automatycznie przypisze do obiektu req.user
  validate(payload: { sub: number; email: string; role: UserRole }) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
