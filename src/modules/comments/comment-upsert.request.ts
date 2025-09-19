import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CommentUpsertRequest {
  @ApiProperty({ description: '댓글 내용', example: '대댓글도 달아야 하나..?', maxLength: 280, required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  content: string;
}
