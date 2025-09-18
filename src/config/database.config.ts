import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  autoLoadEntities: true,
  synchronize: true,
};
