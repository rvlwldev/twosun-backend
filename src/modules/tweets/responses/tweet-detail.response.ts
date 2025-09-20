import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { UserResponse } from '@/modules/users/user.response';
import { CommentResponse } from '@/modules/comments/responses/comment.response';

import { Tweet } from '../entities/tweet.entity';

export class TweetDetailResponse {
  @ApiProperty({ description: '트윗 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '트윗 내용', example: '오늘 날씨가 좋네요!' })
  content: string;

  @ApiProperty({
    description: '트윗 이미지 URL 목록',
    type: [String],
    example: ['https://picsum.photos/500/300?random=1'],
  })
  imageUrls: string[];

  @ApiProperty({ description: '카테고리 정보' })
  category: { id: number; name: string };

  @ApiProperty({ description: '작성 시간', example: '2025-09-19T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '수정 시간', example: '2025-09-19T10:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: '좋아요 수', example: 10 })
  likesCount: number;

  @ApiProperty({ description: '댓글 수', example: 5 })
  commentsCount: number;

  @Type(() => UserResponse)
  @ApiProperty({ description: '작성자 정보' })
  author: UserResponse;

  @Type(() => CommentResponse)
  @ApiProperty({ description: '댓글 목록', type: [CommentResponse] })
  comments: CommentResponse[];

  constructor(tweet: Tweet) {
    this.id = tweet.id;
    this.content = tweet.content;
    this.imageUrls = tweet.images.map((img) => img.url);
    this.category = tweet.category;
    this.createdAt = tweet.createdAt;
    this.updatedAt = tweet.updatedAt;
    this.likesCount = tweet.likesCount || 0;
    this.commentsCount = tweet.commentsCount || 0;
    this.author = {
      id: tweet.author.id,
      nickname: tweet.author.nickname,
      profileImageUrl: tweet.author.profileImageUrl,
    };
    this.comments = tweet.comments.map((comment) => new CommentResponse(comment));
  }
}
