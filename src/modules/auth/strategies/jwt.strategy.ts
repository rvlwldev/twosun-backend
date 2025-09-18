import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '@/modules/auth/interfaces/jwt-payload.interface';
import { jwtConfig } from '@/config/auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret as string,
    });
  }

  async validate(payload: JwtPayload) {
    return { id: payload.id, nickname: payload.nickname };
  }
}
