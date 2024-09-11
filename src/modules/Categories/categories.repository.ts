import { Repository } from 'typeorm';
import { Category } from 'src/entities/categories.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/products.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  //****************************************************************************
  async getCategories(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }
  //****************************************************************************
  async getCategoriesByName(category: string): Promise<Category> {
    return await this.categoryRepository.findOne({ where: { name: category } });
  }

  //****************************************************************************
  async createCategory(category: string) {
    const newCategory = new Category();
    newCategory.name = category;
    await this.categoryRepository.save(newCategory);
  }
  //****************************************************************************
  async addCategories(categoryData: Partial<Category>): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { name: categoryData.name },
    });

    if (!category) {
      const category1 = this.categoryRepository.create(categoryData);

      await this.categoryRepository.save(category1);
    }
    return category;
  }
}
