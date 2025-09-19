import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, ArrayMaxSize, IsUrl } from 'class-validator';

export class TweetUpdateImagesRequest {
  @ApiProperty({
    description: '이미지 URL 목록 (최대 4개)',
    type: [String],
    required: false,
    example: ['https://picsum.photos/500/300?random=1'],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4, { message: '최대 업로드 가능한 이미지 갯수는 "4개" 입니다.' })
  @IsUrl({}, { each: true })
  imageUrls: string[] = [];
}
