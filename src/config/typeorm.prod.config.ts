import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: +configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME') || 'nestjs_db',
  entities: ['dist/entities/*.js'],
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations_typeorm',
});

export default AppDataSource;
