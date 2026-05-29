import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../core/enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Jeśli endpoint nie ma dekoratora @Roles, dostęp jest publiczny (dla zalogowanych)
    if (!requiredRoles) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user?: { id: number; role: UserRole } }>();
    const user = request.user;

    // =========================================================================
    // SERCE DEBUGOWANIA: Te logi wypiszą się w Twoim terminalu podczas żądania
    // =========================================================================
    console.log('\n====== [DEBUG] ROLES GUARD START ======');
    console.log('Metoda HTTP / Endpoint:', context.getHandler().name);
    console.log('Wymagane role z dekoratora @Roles:', requiredRoles);
    console.log('Czy obiekt user istnieje w request?:', !!user);
    if (user) {
      console.log('Dokładna zawartość obiektu user:', user);
      console.log('Typ pola user.role:', typeof user.role);
      console.log(
        'Czy rola pasuje (.includes):',
        requiredRoles.includes(user.role),
      );
    }
    console.log('====== [DEBUG] ROLES GUARD END ======\n');
    // =========================================================================

    // Sytuacja 1: Brak użytkownika w żądaniu
    if (!user) {
      throw new UnauthorizedException(
        'Brak zalogowanego użytkownika w żądaniu (request.user jest puste). Upewnij się, że przesyłasz poprawny nagłówek Bearer Token.',
      );
    }

    // Sytuacja 2: Użytkownik jest, ale ma inną rolę
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Brak wystarczających uprawnień. Twoja rola w tokenie to: "${String(user.role)}", a wymagana rola to: ${requiredRoles.map((r) => `"${String(r)}"`).join(' lub ')}.`,
      );
    }

    return true;
  }
}
