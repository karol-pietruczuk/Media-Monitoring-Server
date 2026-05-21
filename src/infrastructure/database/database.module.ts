import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSourceOptions } from './data-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        return {
          ...dataSourceOptions,
          type: 'mssql',
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.user'),
          password: configService.get<string>('database.pass'),
          database: configService.get<string>('database.name'),
          autoLoadEntities: true,
        } as TypeOrmModuleOptions; // <-- Rzutowanie rozwiązuje konflikt 'poolSize'
      },
    }),
  ],
  // Usunąłem DataBaseService, ponieważ ustaliliśmy, że jest na ten moment pusty i niepotrzebny
})
export class DataBaseModule {}
