import { INestApplication } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import request from 'supertest';

import { setupTest, teardownTest } from './setup/test-setup';

import { User } from '@/modules/users/user.entity';
import { Category } from '@/modules/categories/category.entity';
import { Tweet } from '@/modules/tweets/entities/tweet.entity';
import { TEST_SEED_USERS, TEST_SEED_CATEGORIES } from './setup/seed.data';
import { TweetLike } from '@/modules/tweets/entities/tweet-like.entity';

describe('트윗 (Tweet) e2e 테스트', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userRepository: Repository<User>;
  let categoryRepository: Repository<Category>;
  let tweetRepository: Repository<Tweet>;
  let tweetLikeRepository: Repository<TweetLike>;

  let testUsers: User[];
  const userTokens: { [key: string]: string } = {};
  let testTweet: Tweet;

  beforeAll(async () => {
    const setup = await setupTest();

    app = setup.app;
    dataSource = setup.dataSource;
    userRepository = dataSource.getRepository(User);
    categoryRepository = dataSource.getRepository(Category);
    tweetRepository = dataSource.getRepository(Tweet);
    tweetLikeRepository = dataSource.getRepository(TweetLike);

    testUsers = await userRepository.find();

    const user = await userRepository.findOneByOrFail({ id: TEST_SEED_USERS[0].id });
    const category = await categoryRepository.findOneByOrFail({ id: TEST_SEED_CATEGORIES[0].id });
    testTweet = await tweetRepository.save(
      tweetRepository.create({
        content: '테스트 트윗',
        author: user,
        category: category,
        images: [],
      }),
    );

    for (const userData of TEST_SEED_USERS) {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ id: userData.id, password: userData.password });
      userTokens[userData.id] = response.body.access_token;
    }
  });

  beforeEach(async () => {
    const users = await userRepository.find();
    expect(users.length).toEqual(3);
  });

  afterEach(async () => {
    await tweetLikeRepository.clear();
  });

  afterAll(async () => await teardownTest(app));

  describe('좋아요 저장', () => {
    it('동시에 좋아요를 눌러도 결국 좋아요는 유저 수 만큼 누적', async () => {
      await Promise.all(
        testUsers.map((user) =>
          request(app.getHttpServer())
            .post(`/tweets/${testTweet.id}/like`)
            .set('Authorization', `Bearer ${userTokens[user.id]}`)
            .expect(200),
        ),
      );

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const tweet = await tweetRepository.findOneOrFail({ where: { id: testTweet.id }, relations: ['likes'] });
      expect(tweet.likes.length).toBe(testUsers.length);
    });

    it('한 유저의 좋아요는 중복될 수 없음', async () => {
      await Promise.all([
        await request(app.getHttpServer())
          .post(`/tweets/${testTweet.id}/like`)
          .set('Authorization', `Bearer ${userTokens[testUsers[0].id]}`)
          .expect(200),
        await request(app.getHttpServer())
          .post(`/tweets/${testTweet.id}/like`)
          .set('Authorization', `Bearer ${userTokens[testUsers[0].id]}`)
          .expect(200),
        await request(app.getHttpServer())
          .post(`/tweets/${testTweet.id}/like`)
          .set('Authorization', `Bearer ${userTokens[testUsers[0].id]}`)
          .expect(200),
      ]);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const tweet = await tweetRepository.findOneOrFail({ where: { id: testTweet.id }, relations: ['likes'] });
      expect(tweet.likes.length).toBe(1);
    });
  });

  describe('동시 좋아요 삭제', () => {
    beforeEach(async () => {
      const query = 'INSERT INTO tweet_likes (tweetId, userId) VALUES (?, ?)';
      for (const user of testUsers) {
        await dataSource.query(query, [testTweet.id, user.id]);
      }
    });

    it('동시 좋아요 취소 시 결국 누른 만큼 삭제', async () => {
      await Promise.all(
        testUsers.map((user) =>
          request(app.getHttpServer())
            .delete(`/tweets/${testTweet.id}/like`)
            .set('Authorization', `Bearer ${userTokens[user.id]}`)
            .expect(204),
        ),
      );

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const tweet = await tweetRepository.findOneOrFail({ where: { id: testTweet.id }, relations: ['likes'] });
      expect(tweet.likes.length).toBe(0);
    });

    it('좋아요를 누르지 않고 취소해도 에러 없음', async () => {
      const query = 'DELETE FROM tweet_likes WHERE tweetId = ? AND userId = ?';
      await dataSource.query(query, [testTweet.id, testUsers[2].id]);

      await request(app.getHttpServer())
        .delete(`/tweets/${testTweet.id}/like`)
        .set('Authorization', `Bearer ${userTokens[testUsers[2].id]}`)
        .expect(204);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const updatedTweet = await tweetRepository.findOneOrFail({ where: { id: testTweet.id }, relations: ['likes'] });
      expect(updatedTweet.likes.length).toBe(testUsers.length - 1);
    });
  });

  describe('동시 좋아요 저장/삭제 혼합', () => {
    it('여러명이 동시에 좋아요/취소를 요청', async () => {
      await Promise.all([
        request(app.getHttpServer())
          .post(`/tweets/${testTweet.id}/like`)
          .set('Authorization', `Bearer ${userTokens[testUsers[0].id]}`)
          .expect(200),
        request(app.getHttpServer())
          .post(`/tweets/${testTweet.id}/like`)
          .set('Authorization', `Bearer ${userTokens[testUsers[1].id]}`)
          .expect(200),
        request(app.getHttpServer())
          .delete(`/tweets/${testTweet.id}/like`)
          .set('Authorization', `Bearer ${userTokens[testUsers[2].id]}`)
          .expect(204),
      ]);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const updatedTweet = await tweetRepository.findOneOrFail({
        where: { id: testTweet.id },
        relations: ['likes'],
      });
      expect(updatedTweet.likes.length).toBe(2);
    });

    it('좋아요가 있는 상태에서 동시 좋아요/취소 혼합 요청 시 최종 좋아요 수가 정확해야 한다', async () => {
      const query = 'INSERT INTO tweet_likes (tweetId, userId) VALUES (?, ?)';
      await dataSource.query(query, [testTweet.id, testUsers[1].id]);

      await Promise.all([
        // 좋아요
        request(app.getHttpServer())
          .post(`/tweets/${testTweet.id}/like`)
          .set('Authorization', `Bearer ${userTokens[testUsers[0].id]}`)
          .expect(200),
        // 취소
        request(app.getHttpServer())
          .delete(`/tweets/${testTweet.id}/like`)
          .set('Authorization', `Bearer ${userTokens[testUsers[1].id]}`)
          .expect(204),
        // 좋아요
        request(app.getHttpServer())
          .post(`/tweets/${testTweet.id}/like`)
          .set('Authorization', `Bearer ${userTokens[testUsers[2].id]}`)
          .expect(200),
      ]);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const updatedTweet = await tweetRepository.findOneOrFail({
        where: { id: testTweet.id },
        relations: ['likes'],
      });
      expect(updatedTweet.likes.length).toBe(2);
    });
  });
});
