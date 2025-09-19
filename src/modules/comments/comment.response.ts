import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { Comment } from '@/modules/comments/entities/comment.entity';
import { UserResponse } from '@/modules/users/user.response';

export class CommentResponse {
  @ApiProperty({ description: '댓글 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '댓글 내용', example: '댓글 기능 구현중 ... ' })
  content: string;

  @ApiProperty({ description: '작성 시간', example: '2025-09-19T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '수정 시간', example: '2025-09-19T10:00:00.000Z' })
  updatedAt: Date;

  @Type(() => UserResponse)
  @ApiProperty({ description: '작성자 정보' })
  author: UserResponse;

  constructor(comment: Comment) {
    this.id = comment.id;
    this.content = comment.content;
    this.createdAt = comment.createdAt;
    this.updatedAt = comment.updatedAt;
    this.author = {
      id: comment.author.id,
      nickname: comment.author.nickname,
      profileImageUrl: comment.author.profileImageUrl,
    };
  }
}
