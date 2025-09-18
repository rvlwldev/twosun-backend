import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginRequest {
  @ApiProperty({ description: '사용자 ID', example: 'testuser123' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: '비밀번호', example: 'password123!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
