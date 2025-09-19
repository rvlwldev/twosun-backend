import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';

import { UserModule } from '@/modules/users/user.module';
import { TweetModule } from '@/modules/tweets/tweet.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UserModule, TweetModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentsModule {}
