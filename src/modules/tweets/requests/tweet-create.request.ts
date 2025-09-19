import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsArray, ArrayMaxSize, IsUrl, IsNumber, IsOptional } from 'class-validator';

export class TweetCreateRequest {
  @ApiProperty({ description: '카테고리 ID', example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({
    description: '트윗 내용',
    example: '김형준 개발 과제 테스트 보는중 ... ',
    maxLength: 280,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(280, { message: '트윗의 최대 글자 수는 280자 입니다.' })
  content: string;

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
