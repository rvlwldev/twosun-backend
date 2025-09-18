import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserCreateRequest } from './user.request';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@/modules/users/user.entity';

@ApiTags('사용자')
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

  @ApiOperation({ summary: '사용자 프로필 조회' })
  @ApiResponse({ status: HttpStatus.OK, description: '사용자 프로필 조회 성공', type: User })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '사용자를 찾을 수 없음' })
  @Get(':id')
  async getUserProfile(@Param('id') id: string): Promise<User> {
    return this.service.findUserById(id);
  }
}
