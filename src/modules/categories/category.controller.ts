import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { Category } from './category.entity';

@ApiTags('카테고리')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: '카테고리 목록 조회' })
  @ApiResponse({ status: HttpStatus.OK, description: '카테고리 목록 조회 성공', type: [Category] })
  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }
}
