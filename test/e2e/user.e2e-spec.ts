import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { setupAppTest, teardownTest, initDatabase } from './setup/test-setup';
import * as bcrypt from 'bcrypt';
import { User } from '@/modules/users/user.entity';

describe('사용자 (User) e2e 테스트', () => {
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

  describe('사용자 프로필 조회 기능', () => {
    it('ID로 프로필 조회 시 사용자 정보 반환', async () => {
      const response = await request(app.getHttpServer()).get(`/users/${testUser.id}`).expect(200);

      expect(response.body.id).toEqual(testUser.id);
      expect(response.body.name).toEqual(testUser.name);
      expect(response.body.nickname).toEqual(testUser.nickname);
      expect(response.body.profileImageUrl).toEqual(testUser.profileImageUrl);
      expect(response.body).not.toHaveProperty('password');
    });

    it('존재하지 않는 ID로 프로필 조회 시 404 에러 반환', async () => {
      await request(app.getHttpServer())
        .get('/users/not-exist-user-id')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toEqual('해당 ID를 찾을 수 없습니다.');
        });
    });
  });
});
