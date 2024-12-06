import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'authdb',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, 
  logging: true,
  autoLoadEntities: true,
  retryDelay: 3000,
  retryAttempts: 10,
};