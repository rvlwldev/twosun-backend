import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from '@/modules/users/user.service';
import { CategoryService } from '@/modules/categories/category.service';
import { User } from '@/modules/users/user.entity';
import { Category } from '@/modules/categories/category.entity';
import { Comment } from '@/modules/comments/entities/comment.entity';

import { Tweet } from './entities/tweet.entity';
import { TweetImage } from './entities/tweet-image.entity';
import { Retweet } from './entities/retweet.entity';
import { TweetLike } from './entities/tweet-like.entity';
import { TweetsController } from './tweet.controller';
import { TweetService } from './tweet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tweet, TweetImage, Retweet, TweetLike, Comment, User, Category])],
  controllers: [TweetsController],
  providers: [TweetService, UserService, CategoryService],
  exports: [TweetService],
})
export class TweetsModule {}
