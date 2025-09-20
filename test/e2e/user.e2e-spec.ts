import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { setupTest, teardownTest } from './setup/test-setup';

import { TEST_SEED_USERS } from './setup/seed.data'; // Use TEST_SEED_USERS

describe('사용자 (User) e2e 테스트', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const setup = await setupTest();

    app = setup.app;
  });

  afterAll(async () => await teardownTest(app));

  describe('사용자 프로필 조회 기능', () => {
    it('ID로 프로필 조회 시 사용자 정보 반환', async () => {
      const user = TEST_SEED_USERS[0];

      const response = await request(app.getHttpServer()).get(`/users/${user.id}`).expect(200);

      expect(response.body.id).toBe(user.id);
      expect(response.body.name).toBe(user.name);
      expect(response.body.nickname).toBe(user.nickname);
    });

    it('존재하지 않는 ID로 프로필 조회 시 404 에러 반환', async () => {
      await request(app.getHttpServer()).get('/users/nonexistentuser').expect(404);
    });
  });
});
