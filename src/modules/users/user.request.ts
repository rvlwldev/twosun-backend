import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches, IsOptional, IsUrl } from 'class-validator';

export class UserCreateRequest {
  @IsNotEmpty({ message: '아이디는 필수값입니다.' })
  @IsString()
  @Matches(/^[a-z0-9]+$/, { message: 'ID는 영문 소문자와 숫자만 허용됩니다.' })
  @ApiProperty({ description: '사용자 ID (영문소문자, 숫자 허용)', example: 'testuser123' })
  id: string;

  @IsString({ message: '이름은 한글 또는 영문만 허용됩니다.' })
  @IsNotEmpty({ message: '이름은 필수값 입니다.' })
  @Matches(/^[a-zA-Z가-힣]+$/, { message: '이름은 한글 또는 영문만 허용됩니다.' })
  @ApiProperty({ description: '사용자 이름 (한글, 영문대소문자 허용)', example: '홍길동' })
  name: string;

  @IsNotEmpty({ message: '닉네임은 필수값입니다.' })
  @IsString()
  @Matches(/^[a-z]+$/, { message: '닉네임은 영문 소문자만 허용됩니다.' })
  @ApiProperty({ description: '닉네임 (영문소문자 허용, 중복 불가)', example: 'nickname' })
  nickname: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/, {
    message: '비밀번호는 영문 소문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.',
  })
  @ApiProperty({ description: '비밀번호 (영문소문자, 숫자, 특수문자 1개 이상 포함)', example: 'password123!' })
  password: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({ description: '프로필 이미지 URL', example: 'https://picsum.photos/40/40?random=1', required: false })
  profileImageUrl?: string;
}
