import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Ładowanie pliku .env z głównego katalogu na potrzeby TypeORM CLI (np. npx typeorm migration:run)
// data-source.ts znajduje się w src/infrastructure/database, stąd wyjście 3 poziomy w górę
dotenv.config({ path: path.join(__dirname, '../../../.env') });

export const dataSourceOptions: DataSourceOptions = {
  type: 'mssql',
  host: process.env.DB_HOST || '192.168.92.100',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  username: process.env.DB_USER || 'Node_User',
  password: process.env.DB_PASS || '123',
  database: process.env.DB_NAME || 'Test',
  entities: [__dirname + '/../../**/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  logging: process.env.NODE_ENV !== 'production', // Włączone logowanie tylko poza produkcją
  migrationsRun: true, // Automatyczne uruchamianie migracji przy starcie aplikacji
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
