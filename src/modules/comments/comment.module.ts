import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tweet } from '@/modules/tweets/entities/tweet.entity';
import { User } from '@/modules/users/user.entity';
import { UserModule } from '@/modules/users/user.module';
import { TweetsModule } from '@/modules/tweets/tweet.module';

import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Tweet, User]), UserModule, TweetsModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentsModule {}
