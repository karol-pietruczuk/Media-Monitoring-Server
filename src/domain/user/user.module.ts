import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserHistory } from './entities/user-history.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserHistoryListener } from './listeners/user-history.listener';

@Module({
  imports: [
    // Rejestrujemy obie encje w kontekście TypeORM dla bazy MSSQL
    TypeOrmModule.forFeature([User, UserHistory]),
  ],
  controllers: [
    // Wystawia endpointy HTTP (CRUD) dla React / Electron
    UserController,
  ],
  providers: [
    // Główny serwis zarządzający danymi użytkowników
    UserService,
    // Słuchacz modułu Events odpowiedzialny za bezblokujący zapis historii w tle
    UserHistoryListener,
  ],
  exports: [
    // Eksportujemy UserService, aby moduł uwierzytelniania (features/auth)
    // mógł weryfikować login i hasło podczas generowania tokenów JWT
    UserService,
  ],
})
export class UserModule {}
