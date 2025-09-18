import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/modules/users/user.entity';
import { UserCreateRequest } from '@/modules/users/user.request';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async createUser(req: UserCreateRequest): Promise<User> {
    const user = await this.repo.findOne({
      where: [{ id: req.id }, { nickname: req.nickname }],
    });

    if (user) {
      if (user.id == req.id) {
        throw new ConflictException('이미 사용 중인 ID 입니다.');
      }

      if (user.nickname == req.nickname) {
        throw new ConflictException('이미 사용 중인 닉네임입니다.');
      }
    }

    return this.repo.save(this.repo.create(req));
  }

  async findUserById(id: string) {
    return await this.repo.findOne({ where: { id } });
  }
}
