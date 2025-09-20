import { Controller, Post, UseGuards, Body, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CredentialGuard } from '@/modules/auth/guards/credential.guard';
import { AuthService } from '@/modules/auth/auth.service';
import { LoginRequest } from '@/modules/auth/auth-login.request';
import { User } from '@/modules/users/user.entity';

@ApiTags('사용자')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @ApiOperation({ summary: '사용자 로그인' })
  @ApiBody({ type: LoginRequest })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '로그인 성공',
    schema: { example: { access_token: 'jwt.token' } },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '인증 실패' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(CredentialGuard)
  async login(@Request() req: { user: User }) {
    return this.service.login(req.user);
  }
}
