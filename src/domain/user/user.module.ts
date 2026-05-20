import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserHistory } from './entities/user-history.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserHistoryListener } from './listeners/user-history.listener';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserHistory])],
  controllers: [UserController],
  providers: [UserService, UserHistoryListener], // Dodano UserHistoryListener
  exports: [UserService],
})
export class UserModule {}
