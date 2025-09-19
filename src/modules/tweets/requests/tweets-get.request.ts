import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class TweetsGetRequest {
  @ApiPropertyOptional({ description: '카테고리 ID', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;

  @ApiPropertyOptional({ description: '페이지당 항목 수', example: 10, required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  count?: number = 10;

  @ApiPropertyOptional({ description: '페이지 번호', example: 1, required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ description: '정렬 순서 (asc: 오름차순, desc: 내림차순)', example: 'desc', default: 'desc' })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  orderBy?: 'asc' | 'desc' = 'desc';
}
