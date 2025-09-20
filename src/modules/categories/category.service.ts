import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private readonly repo: Repository<Category>) {}

  async findAll(): Promise<Category[]> {
    return this.repo.find();
  }

  async findCategoryById(id: number): Promise<Category> {
    const category = await this.repo.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`존재하지 않는 카테고리입니다.`);
    }

    return category;
  }

  async createCategory(name: string): Promise<Category> {
    return this.repo.save(this.repo.create({ name }));
  }
}
