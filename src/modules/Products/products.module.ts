import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { Product } from 'src/entities/products.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/categories.entity';
import { CategoryRepository } from '../Categories/categories.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  providers: [ProductsService, ProductsRepository, CategoryRepository],
  controllers: [ProductsController],
})
export class ProductsModule {}
