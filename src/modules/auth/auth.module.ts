import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@/modules/users/user.module';
import { LocalCredentialsStrategy } from './strategies/local-credentials-strategy.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { jwtConfig } from '@/config/auth.config';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register(jwtConfig)],
  providers: [AuthService, LocalCredentialsStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
