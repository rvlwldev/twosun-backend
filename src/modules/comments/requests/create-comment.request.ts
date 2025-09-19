import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommentRequest {
  @ApiProperty({ description: '댓글 내용', example: '정말 좋은 글이네요!', maxLength: 280 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  content: string;

  @ApiProperty({ description: '부모 댓글 ID (대댓글인 경우)', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  parentId?: number;
}