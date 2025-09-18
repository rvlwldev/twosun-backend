import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { User } from '@/modules/users/user.entity';
import { setupAppTest, teardownTest, initDatabase } from './setup/test-setup';
import * as bcrypt from 'bcrypt';

describe('인증 (Auth) e2e 테스트', () => {
  let app: INestApplication;

  let dataSource: DataSource;
  let userRepository: Repository<User>;

  const testUser = {
    id: 'test-user',
    name: '테스트유저',
    nickname: 'test-nickname',
    password: 'test-password!23',
    profileImageUrl: 'https://picsum.photos/40/40?random=1',
  };

  beforeAll(async () => {
    const setup = await setupAppTest();

    app = setup.app;
    dataSource = setup.dataSource;
    userRepository = dataSource.getRepository(User);
  });

  beforeEach(async () => {
    await initDatabase(dataSource);

    const password = await bcrypt.hash(testUser.password, 10);
    await userRepository.save({ ...testUser, password });
  });

  afterAll(async () => await teardownTest(app));

  describe('사용자 로그인 기능', () => {
    it('유효한 자격 증명으로 로그인 성공 시 access_token 반환', async () => {
      const login = { id: testUser.id, password: testUser.password };
      const response = await request(app.getHttpServer()).post('/auth/login').send(login).expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(typeof response.body.access_token).toBe('string');
    });

    it('유효하지 않은 비밀번호로 로그인 시 401 에러 반환', async () => {
      const login = { id: testUser.id, password: 'wrong-password' };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(login)
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toEqual('비밀번호가 올바르지 않습니다.');
        });
    });

    it('존재하지 않는 ID로 로그인 시 404 에러 반환', async () => {
      const login = { id: 'wrong-user', password: testUser.password };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(login)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toEqual('해당 ID를 찾을 수 없습니다.');
        });
    });
  });
});
