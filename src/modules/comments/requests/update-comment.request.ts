import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCommentRequest {
  @ApiProperty({ description: '수정할 댓글 내용', example: '정말 좋은 글이네요! 감사합니다.', maxLength: 280 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  content: string;
}
