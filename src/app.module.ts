import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '@/config/database.config';
import { winstonConfig } from '@/config/winston.config';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { ExceptionsFilter } from '@/common/exception.filter';
import { UsersModule } from '@/modules/users/user.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), WinstonModule.forRoot(winstonConfig), UsersModule, AuthModule],
  controllers: [],
  providers: [{ provide: APP_FILTER, useClass: ExceptionsFilter }],
})
export class AppModule {}
