import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { UserResponse } from '@/modules/users/user.response';

import { Comment } from '../entities/comment.entity';

export class CommentResponse {
  @ApiProperty({ description: '댓글 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '댓글 내용', example: '정말 좋은 글이네요!' })
  content: string;

  @ApiProperty({ description: '작성자 정보' })
  @Type(() => UserResponse)
  author: UserResponse;

  @ApiProperty({ description: '대댓글 목록', type: () => [CommentResponse] })
  @Type(() => CommentResponse)
  children: CommentResponse[];

  @ApiProperty({ description: '작성 시간', example: '2025-09-21T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '수정 시간', example: '2025-09-21T10:00:00.000Z' })
  updatedAt: Date;

  constructor(comment: Comment) {
    this.id = comment.id;
    this.content = comment.content;
    this.author = new UserResponse(comment.author);
    this.createdAt = comment.createdAt;
    this.updatedAt = comment.updatedAt;

    if (comment.children && Array.isArray(comment.children)) {
      this.children = comment.children.map((child) => new CommentResponse(child));
    }
  }
}
