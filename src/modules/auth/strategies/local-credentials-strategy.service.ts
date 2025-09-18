import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/modules/users/user.service';

@Injectable()
export class LocalCredentialsStrategy extends PassportStrategy(Strategy, 'credentials') {
  constructor(private userService: UserService) {
    super({ usernameField: 'id' });
  }

  async validate(id: string, password: string): Promise<any> {
    const user = await this.userService.findUserById(id);

    if (user == null) {
      throw new NotFoundException('해당 ID를 찾을 수 없습니다.');
    }

    if (!(await user.isPassword(password))) {
      throw new UnauthorizedException('비밀번호가 올바르지 않습니다.');
    }

    return user;
  }
}
