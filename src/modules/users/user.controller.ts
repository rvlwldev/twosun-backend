import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserCreateRequest } from './user.request';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '@/modules/users/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '사용자 생성 성공', type: User })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: '이미 사용 중인 ID 또는 닉네임' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '유효성 검사 실패' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async postUser(@Body() req: UserCreateRequest): Promise<User> {
    return this.service.createUser(req);
  }
}
