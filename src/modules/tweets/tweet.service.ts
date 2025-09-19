import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserService } from '@/modules/users/user.service';
import { CategoryService } from '@/modules/categories/category.service';

import { Tweet } from './entities/tweet.entity';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet) private readonly repo: Repository<Tweet>,
    private readonly datasource: DataSource,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
  ) {}

  private NOT_FOUND_ERROR_MESSAGE = '존재하지 않는 트윗입니다.';

  async createTweet(userId: string, categoryId: number, content: string, imageUrls: string[]): Promise<Tweet> {
    return this.datasource.transaction(async (manager) => {
      const category = await this.categoryService.findCategoryById(categoryId);
      const author = await this.userService.findUserById(userId);
      const tweet = manager.create(Tweet, { author, content, category });

      tweet.addAllImageUrls(imageUrls);

      return await manager.save(tweet);
    });
  }

  async findTweetById(id: number): Promise<Tweet> {
    return this.repo.findOneByOrFail({ id }).catch((err) => {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(this.NOT_FOUND_ERROR_MESSAGE);
      }
      throw err;
    });
  }

  async findTweetByIdWithAllRelations(id: number): Promise<Tweet & { likeCount: number; commentCount: number }> {
    return this.repo
      .createQueryBuilder('tweet')
      .leftJoinAndSelect('tweet.author', 'author')
      .leftJoinAndSelect('tweet.category', 'category')
      .leftJoinAndSelect('tweet.images', 'images')
      .leftJoinAndSelect('tweet.comments', 'comments')
      .leftJoinAndSelect('comments.author', 'commentAuthor')
      .loadRelationCountAndMap('tweet.likeCount', 'tweet.likes')
      .loadRelationCountAndMap('tweet.commentCount', 'tweet.comments')
      .where('tweet.id = :id', { id })
      .getOneOrFail()
      .catch((err) => {
        if (err instanceof NotFoundException) {
          throw new NotFoundException(this.NOT_FOUND_ERROR_MESSAGE);
        }
        throw err;
      }) as Promise<Tweet & { likeCount: number; commentCount: number }>;
  }

  async findTweetsPage(
    categoryId: number | undefined,
    count: number = 10,
    page: number = 1,
    orderBy: string = 'desc',
  ): Promise<(Tweet & { likeCount: number; commentCount: number })[]> {
    const query = this.repo
      .createQueryBuilder('tweet')
      .leftJoinAndSelect('tweet.author', 'author')
      .leftJoinAndSelect('tweet.category', 'category')
      .leftJoinAndSelect('tweet.images', 'images')
      .loadRelationCountAndMap('tweet.likeCount', 'tweet.likes')
      .loadRelationCountAndMap('tweet.commentCount', 'tweet.comments')
      .orderBy('tweet.createdAt', orderBy === 'asc' ? 'ASC' : 'DESC')
      .take(count)
      .skip((page - 1) * count);

    if (categoryId) query.andWhere('tweet.categoryId = :categoryId', { categoryId });

    return query.getMany() as Promise<(Tweet & { likeCount: number; commentCount: number })[]>;
  }

  async updateTweetContent(userId: string, tweetId: number, content: string): Promise<Tweet> {
    const user = await this.userService.findUserById(userId);
    const tweet = await this.findTweetById(tweetId);

    if (tweet.author.seq != user.seq) {
      throw new ForbiddenException('자신이 작성한 트윗의 내용만 수정할 수 있습니다.');
    }
    tweet.content = content;

    return tweet;
  }

  async updateTweetImages(userId: string, tweetId: number, imageUrls: string[]): Promise<Tweet> {
    return this.datasource.transaction(async (manager) => {
      const user = await this.userService.findUserById(userId);
      const tweet = await this.findTweetById(tweetId);

      if (tweet.author.seq != user.seq) {
        throw new ForbiddenException('자신이 작성한 트윗의 이미지만 수정할 수 있습니다.');
      }
      tweet.updateAllImages(imageUrls);

      return manager.save(tweet);
    });
  }

  // 요구사항에 없어서 스킵
  // async deleteTweetImages(id: number, indexes: number[]): Promise<void>

  async deleteTweetById(userId: string, tweetId: number): Promise<void> {
    const user = await this.userService.findUserById(userId);
    const tweet = await this.findTweetById(tweetId);

    if (tweet.author.seq != user.seq) {
      throw new ForbiddenException('자신이 작성한 트윗만 삭제할 수 있습니다.');
    }

    const result = await this.repo.softDelete(tweet.id);

    if (result.affected == 0) {
      throw new NotFoundException('이미 삭제되었거나 존재하지 않는 트윗입니다.');
    }
  }
}
