import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { setupTest, teardownTest } from './setup/test-setup';

import { TEST_SEED_USERS } from './setup/seed.data';

describe('인증 (Auth) e2e 테스트', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const setup = await setupTest();
    app = setup.app;
  });

  afterAll(async () => await teardownTest(app));

  describe('사용자 로그인 기능', () => {
    it('유효한 자격 증명으로 로그인 성공 시 access_token 반환', async () => {
      const user = TEST_SEED_USERS[0];

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ id: user.id, password: user.password })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
    });

    it('유효하지 않은 비밀번호로 로그인 시 401 에러 반환', async () => {
      const user = TEST_SEED_USERS[0];

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ id: user.id, password: 'wrongpassword' })
        .expect(401);
    });

    it('존재하지 않는 ID로 로그인 시 404 에러 반환', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ id: 'nonexistentuser', password: 'password123!' })
        .expect(404);
    });
  });
});
