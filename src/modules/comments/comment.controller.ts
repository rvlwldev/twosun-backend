import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '@/modules/auth/guards/jwt.guard';
import type { AuthenticatedRequest } from '@/modules/auth/auth-authenticated.request';

import { CommentService } from './comment.service';
import { CreateCommentRequest } from './requests/create-comment.request';
import { CommentResponse } from './comment.response';
import { UpdateCommentRequest } from '@/modules/comments/requests/update-comment.request';

@ApiTags('댓글')
@Controller()
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @ApiOperation({ summary: '댓글 작성', description: '특정 트윗에 새로운 댓글을 작성합니다.' })
  @ApiResponse({ status: 201, description: '댓글 작성 성공', type: CommentResponse })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 404, description: '트윗 또는 부모 댓글을 찾을 수 없음' })
  @ApiBearerAuth()
  @Post('tweets/:tweetId/comments')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  async postComment(
    @Param('tweetId') tweetId: number,
    @Body() request: CreateCommentRequest,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommentResponse> {
    const { content, parentId } = request;
    return this.service
      .createComment(req.user.id, tweetId, content, parentId)
      .then((comment) => new CommentResponse(comment));
  }

  @ApiOperation({
    summary: '트윗의 댓글 목록 조회',
    description: '특정 트윗에 달린 댓글 목록을 계층 구조로 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '조회 성공', type: [CommentResponse] })
  @Get('tweets/:tweetId/comments')
  async getComments(@Param('tweetId') tweetId: number): Promise<CommentResponse[]> {
    return this.service
      .findCommentsByTweet(tweetId)
      .then((comments) => comments.map((comment) => new CommentResponse(comment)));
  }

  @ApiOperation({ summary: '댓글 수정', description: '특정 댓글의 내용을 수정합니다.' })
  @ApiResponse({ status: 200, description: '수정 성공', type: CommentResponse })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @ApiResponse({ status: 404, description: '댓글을 찾을 수 없음' })
  @ApiBearerAuth()
  @Patch('comments/:commentId')
  @UseGuards(JwtGuard)
  async patchComment(
    @Param('commentId') commentId: number,
    @Body() request: UpdateCommentRequest,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommentResponse> {
    return this.service
      .updateComment(req.user.id, commentId, request.content)
      .then((comment) => new CommentResponse(comment));
  }

  @ApiOperation({ summary: '댓글 삭제', description: '특정 댓글을 삭제합니다.' })
  @ApiResponse({ status: 204, description: '삭제 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @ApiResponse({ status: 404, description: '댓글을 찾을 수 없음' })
  @ApiBearerAuth()
  @Delete('comments/:commentId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(@Param('commentId') commentId: number, @Req() req: AuthenticatedRequest): Promise<void> {
    await this.service.deleteComment(req.user.id, commentId);
  }
}
