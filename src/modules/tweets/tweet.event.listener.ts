import { Inject, Injectable, type LoggerService } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TweetLike } from './entities/tweet-like.entity';
import { TweetLikeEvent } from './events/tweet-like.event';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class TweetEventListener {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
    @InjectRepository(TweetLike) private readonly repo: Repository<TweetLike>,
  ) {}

  @OnEvent('tweet.liked')
  async handleTweetLikedEvent(event: TweetLikeEvent) {
    try {
      await this.repo.save({ tweet: { id: event.tweetId }, user: { id: event.userId } });
    } catch (error) {
      this.logger.warn('Event Fail (tweet.liked)', error);
    }
  }

  @OnEvent('tweet.unliked')
  async handleTweetUnlikedEvent(event: TweetLikeEvent) {
    await this.repo.delete({
      tweet: { id: event.tweetId },
      user: { id: event.userId },
    });
  }
}
