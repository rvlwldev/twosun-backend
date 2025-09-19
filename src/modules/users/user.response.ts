import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/modules/users/user.entity';

export class UserResponse {
  @ApiProperty({ description: '유저 ID', example: 'testuser123' })
  id: string;

  @ApiProperty({ description: '유저 닉네임', example: 'testnickname' })
  nickname: string;

  @ApiProperty({ description: '유저 프로필 이미지 URL', example: 'https://picsum.photos/40/40?random=1' })
  profileImageUrl: string;

  constructor(user: User) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.profileImageUrl = user.profileImageUrl;
  }
}
