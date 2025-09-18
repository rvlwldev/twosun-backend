import { JwtModuleOptions } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET_KEY || 'supersecret',
  signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '60s' },
};
