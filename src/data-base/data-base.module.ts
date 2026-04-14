import { Module } from '@nestjs/common';
import { DataBaseService } from './data-base.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: '192.168.92.100',
      port: 1433,
      username: 'Node_User',
      password: '123',
      database: 'Test',
      autoLoadEntities: true,
      //synchronize: true, // ⚠️ tylko dev!
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    }),
  ],
  providers: [DataBaseService],
})
export class DatabaseModule {}
