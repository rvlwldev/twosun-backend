import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/modules/users/user.entity';
import { JwtPayload } from '@/modules/auth/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: User) {
    const payload: JwtPayload = { id: user.id, nickname: user.nickname };

    return { access_token: this.jwtService.sign(payload) };
  }
}
