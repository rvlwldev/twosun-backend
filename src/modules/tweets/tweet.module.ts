import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@/modules/users/user.module';
import { CategoryModule } from '@/modules/categories/category.module';

import { Tweet } from './entities/tweet.entity';
import { TweetImage } from './entities/tweet-image.entity';
import { Retweet } from './entities/retweet.entity';
import { TweetLike } from './entities/tweet-like.entity';
import { TweetsController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { TweetEventListener } from './tweet.event.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tweet, TweetImage, Retweet, TweetLike]),
    UserModule,
    CategoryModule,
  ],
  controllers: [TweetsController],
  providers: [TweetService, TweetEventListener],
  exports: [TweetService],
})
export class TweetsModule {}
