import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { Category } from '@/modules/categories/category.entity';
import { UserResponse } from '@/modules/users/user.response';

import { Tweet } from '../entities/tweet.entity';

export class TweetSimpleResponse {
  @ApiProperty({ description: '트윗 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '카테고리 정보' })
  category: Category;

  @ApiProperty({ description: '트윗 내용', example: '오늘 날씨가 좋네요!' })
  content: string;

  @Type(() => UserResponse)
  @ApiProperty({ description: '작성자 정보' })
  author: UserResponse;

  @ApiProperty({
    description: '트윗 이미지 URL 목록',
    type: [String],
    example: ['https://picsum.photos/500/300?random=1'],
  })
  imageUrls: string[];

  @ApiProperty({ description: '작성 시간', example: '2025-09-19T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '좋아요 수', example: 10 })
  likeCount: number;

  @ApiProperty({ description: '댓글 수', example: 5 })
  commentCount: number;

  constructor(tweet: Tweet, likeCount: number, commentCount: number) {
    this.id = tweet.id;
    this.category = tweet.category;
    this.content = tweet.content;
    this.author = new UserResponse(tweet.author);
    this.imageUrls = tweet.images.map((image) => image.url);
    this.createdAt = tweet.createdAt;

    this.likeCount = likeCount;
    this.commentCount = commentCount;
  }
}
