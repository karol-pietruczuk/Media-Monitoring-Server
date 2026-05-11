import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mssql',
  host: '192.168.92.100',
  port: 1433,
  username: 'Node_User',
  password: '123',
  database: 'Test',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  logging: true,
  migrationsRun: true,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
//npm run migration:generate -- src/database/migrations/Init
//npm run migration:run
