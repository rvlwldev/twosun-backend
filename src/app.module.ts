import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '@/config/database.config';
import { winstonConfig } from '@/config/winston.config';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { ExceptionFilter } from '@/common/exception.filter';
import { UserModule } from '@/modules/users/user.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { TweetModule } from '@/modules/tweets/tweet.module';
import { CommentModule } from '@/modules/comments/comment.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    WinstonModule.forRoot(winstonConfig),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    UserModule,
    AuthModule,
    TweetModule,
    CommentModule,
  ],
  controllers: [],
  providers: [{ provide: APP_FILTER, useClass: ExceptionFilter }],
})
export class AppModule {}
