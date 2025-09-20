import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tweet } from '@/modules/tweets/entities/tweet.entity';
import { User } from '@/modules/users/user.entity';
import { UserModule } from '@/modules/users/user.module';
import { TweetModule } from '@/modules/tweets/tweet.module';

import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Tweet, User]), UserModule, TweetModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
