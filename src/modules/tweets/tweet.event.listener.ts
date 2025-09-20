import { Inject, Injectable, type LoggerService } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { TweetLike } from './entities/tweet-like.entity';
import { TweetLikeEvent } from './tweet-like.event';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class TweetEventListener {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
    @InjectRepository(TweetLike) private readonly repo: Repository<TweetLike>,
    private readonly entityManager: EntityManager,
  ) {}

  private jobMap = new Map<string, (() => Promise<void>)[]>();
  private processMap = new Map<string, boolean>();

  private async processEvent(name: string) {
    const jobs = this.jobMap.get(name);
    if (this.processMap.get(name) || !jobs || jobs.length === 0) return;

    this.processMap.set(name, true);
    const job = jobs.shift();

    if (!job) {
      this.processMap.set(name, false);
      return;
    }

    try {
      await job();
    } finally {
      this.processMap.set(name, false);
      setImmediate(() => this.processEvent(name));
    }
  }

  @OnEvent('tweet.liked')
  async handleTweetLikedEvent(event: TweetLikeEvent) {
    const name = 'tweet.liked';

    if (!this.jobMap.has(name)) this.jobMap.set(name, []);

    this.jobMap.get(name)!.push(async () => {
      try {
        await this.repo.insert({ tweetId: event.tweetId, userId: event.userId });
      } catch (error) {
        this.logger.warn(`Event Fail (${name})`, error);
      }
    });

    await this.processEvent(name);
  }

  @OnEvent('tweet.unliked')
  async handleTweetUnlikedEvent(event: TweetLikeEvent) {
    const name = 'tweet.unliked';

    if (!this.jobMap.has(name)) this.jobMap.set(name, []);

    this.jobMap.get(name)!.push(async () => {
      try {
        await this.repo.delete({ tweetId: event.tweetId, userId: event.userId });
      } catch (error) {
        this.logger.warn(`Event Fail (${name})`, error);
      }
    });

    await this.processEvent(name);
  }
}
