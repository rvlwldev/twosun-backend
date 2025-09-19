import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '@/config/database.config';
import { winstonConfig } from '@/config/winston.config';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { ExceptionsFilter } from '@/common/exception.filter';
import { UserModule } from '@/modules/users/user.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { TweetsModule } from '@/modules/tweets/tweet.module';
import { CommentsModule } from '@/modules/comments/comment.module';
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
    TweetsModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [{ provide: APP_FILTER, useClass: ExceptionsFilter }],
})
export class AppModule {}
