import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
  Get,
  Param,
  Query,
  Patch,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '@/modules/auth/guards/jwt.guard';
import type { AuthenticatedRequest } from '@/modules/auth/auth-authenticated.request';

import { TweetService } from './tweet.service';
import { TweetCreateRequest } from './requests/tweet-create.request';
import { TweetsGetRequest } from './requests/tweets-get.request';
import { TweetSimpleResponse } from './responses/tweet-simple.response';
import { TweetDetailResponse } from './responses/tweet-detail.response';
import { TweetUpdateContentRequest } from '@/modules/tweets/requests/tweet-update-content.request';
import { TweetUpdateImagesRequest } from '@/modules/tweets/requests/tweet-update-images.request';

@ApiTags('트윗 (게시물)')
@Controller('tweets')
export class TweetController {
  constructor(private readonly service: TweetService) {}

  @ApiOperation({ summary: '트윗 작성', description: '새로운 트윗을 작성합니다. 로그인한 사용자만 가능합니다.' })
  @ApiResponse({ status: 201, description: '트윗 작성 성공', type: TweetDetailResponse })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 404, description: '사용자 또는 카테고리를 찾을 수 없음' })
  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  async postTweet(
    @Body() tweetCreateRequest: TweetCreateRequest,
    @Req() req: AuthenticatedRequest,
  ): Promise<TweetDetailResponse> {
    const { categoryId, content, imageUrls } = tweetCreateRequest;

    return this.service
      .createTweet(req.user.id, categoryId, content, imageUrls)
      .then((tweet) => new TweetDetailResponse(tweet));
  }

  @ApiOperation({ summary: '트윗 상세 조회', description: '특정 ID의 트윗을 상세 조회합니다.' })
  @ApiResponse({ status: 200, description: '트윗 상세 조회 성공', type: TweetDetailResponse })
  @ApiResponse({ status: 404, description: '트윗을 찾을 수 없음' })
  @Get(':id')
  async getTweet(@Param('id') id: number): Promise<TweetDetailResponse> {
    return this.service.findTweetByIdWithAllRelations(id).then((tweet) => new TweetDetailResponse(tweet));
  }

  @Get()
  @ApiOperation({
    summary: '트윗 목록 페이지 조회',
    description: '트윗 목록을 카테고리 필터링, 정렬하여 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '트윗 목록 조회 성공', type: [TweetSimpleResponse] })
  async getTweetsPage(@Query() query: TweetsGetRequest): Promise<TweetSimpleResponse[]> {
    const { categoryId, count, page, orderBy } = query;

    return this.service
      .findTweetsPage(categoryId, count, page, orderBy)
      .then((tweets) => tweets.map((tweet) => new TweetSimpleResponse(tweet)));
  }

  @ApiOperation({ summary: '트윗 내용 수정', description: '특정 트윗의 내용을 변경합니다.' })
  @ApiResponse({ status: 204, description: '내용 수정 성공', type: TweetDetailResponse })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 404, description: '트윗을 찾을 수 없음' })
  @ApiBearerAuth()
  @Patch(':id/content')
  @UseGuards(JwtGuard)
  async patchTweetContent(
    @Param('id') id: number,
    @Body() tweetUpdateRequest: TweetUpdateContentRequest,
    @Req() req: AuthenticatedRequest,
  ): Promise<TweetDetailResponse> {
    return this.service
      .updateTweetContent(req.user.id, id, tweetUpdateRequest.content)
      .then((tweet) => new TweetDetailResponse(tweet));
  }

  @ApiOperation({ summary: '트윗 이미지 수정', description: '특정 트윗의 이미지 목록 전체를 교체합니다.' })
  @ApiResponse({ status: 200, description: '이미지 수정 성공', type: TweetDetailResponse })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @ApiResponse({ status: 404, description: '트윗을 찾을 수 없음' })
  @ApiBearerAuth()
  @Put(':id/images')
  @UseGuards(JwtGuard)
  async patchTweetImages(
    @Param('id') id: number,
    @Body() tweetUpdateRequest: TweetUpdateImagesRequest,
    @Req() req: AuthenticatedRequest,
  ): Promise<TweetDetailResponse> {
    return this.service
      .updateTweetImages(req.user.id, id, tweetUpdateRequest.imageUrls)
      .then((tweet) => new TweetDetailResponse(tweet));
  }

  @ApiOperation({ summary: '트윗 좋아요', description: '특정 트윗에 좋아요를 누릅니다.' })
  @ApiResponse({ status: 200, description: '좋아요 요청 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 404, description: '트윗을 찾을 수 없음' })
  @ApiBearerAuth()
  @Post(':id/like')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async postLike(@Param('id') tweetId: number, @Req() req: AuthenticatedRequest): Promise<void> {
    await this.service.likeTweet(req.user.id, tweetId);
  }

  @ApiOperation({ summary: '트윗 좋아요 취소', description: '특정 트윗의 좋아요를 취소합니다.' })
  @ApiResponse({ status: 204, description: '좋아요 취소 요청 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 404, description: '트윗을 찾을 수 없음' })
  @ApiBearerAuth()
  @Delete(':id/like')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLike(@Param('id') tweetId: number, @Req() req: AuthenticatedRequest): Promise<void> {
    await this.service.unlikeTweet(req.user.id, tweetId);
  }

  @ApiOperation({ summary: '트윗 삭제', description: '특정 트윗을 삭제합니다.' })
  @ApiResponse({ status: 204, description: '트윗 삭제 성공' })
  @ApiResponse({ status: 403, description: '권한 없음 (작성자 본인이 아님)' })
  @ApiResponse({ status: 404, description: '트윗을 찾을 수 없음' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTweet(@Param('id') id: number, @Req() req: AuthenticatedRequest): Promise<void> {
    return this.service.deleteTweetById(req.user.id, id);
  }
}
