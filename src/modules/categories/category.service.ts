import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`존재하지 않는 카테고리입니다.`);
    }

    return category;
  }
}
