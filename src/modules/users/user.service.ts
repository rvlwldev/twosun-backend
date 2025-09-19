import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { User } from '@/modules/users/user.entity';
import { UserCreateRequest } from '@/modules/users/user-create.request';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async createUser(req: UserCreateRequest): Promise<User> {
    try {
      return await this.repo.save(this.repo.create(req));
    } catch (error) {
      if (!(error instanceof QueryFailedError)) {
        throw error;
      }

      if (!error.driverError || error.driverError.code != 'ER_DUP_ENTRY') {
        throw error;
      }

      if (error.message.includes('id')) {
        throw new ConflictException('이미 사용 중인 ID 입니다.');
      }

      if (error.message.includes('nickname')) {
        throw new ConflictException('이미 사용 중인 닉네임입니다.');
      }

      throw new ConflictException('이미 사용 중인 ID 또는 닉네임입니다.');
    }
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('해당 ID를 찾을 수 없습니다.');
    }

    return user;
  }
}
