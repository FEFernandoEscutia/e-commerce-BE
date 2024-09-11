import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/dtos/createProduct.dto';
import { UpdateProductDto } from 'src/dtos/updateProduct.dto';
import { Category } from 'src/entities/categories.entity';
import { Product } from 'src/entities/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  //***********************************************************************************
  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  //***********************************************************************************
  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }
  //***********************************************************************************
  async findProductById(id: string) {
    return await this.productRepository.findOne({ where: { id: id } });
  }
  //***********************************************************************************
  async findProductByName(product: string) {
    return await this.productRepository.findOne({
      where: { name: product },
    });
  }
  //***********************************************************************************
  async createProduct(product: CreateProductDto, dbCategory: Category) {
    const newProduct = new Product();
    newProduct.name = product.name;
    newProduct.description = product.description;
    newProduct.price = product.price;
    newProduct.stock = product.stock;
    newProduct.imgUrl = product.imgUrl;
    newProduct.category = dbCategory;

    await this.productRepository.save(newProduct);

    return newProduct;
  }
  //***********************************************************************************
  async addProducts(uniqueProducts: Partial<Product>[]) {
    for (const productData of uniqueProducts) {
      let product = await this.productRepository.findOne({
        where: { name: productData.name },
      });

      if (!product) {
        product = this.productRepository.create(productData);
        await this.productRepository.save(product);
      }
    }
  }
  //***********************************************************************************
  async updateProduct(product: UpdateProductDto, dbProduct: Product) {
    try {
      await this.productRepository.save({ ...dbProduct, ...product });

      return { message: 'The product has been successfully updated' };
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
  //***********************************************************************************

  async deleteProduct(dbProduct: Product) {
    return await this.productRepository.remove(dbProduct);
  }

  //***********************************************************************************

  async upProductAOrder(id: string, stock: number) {
    this.productRepository.update(id, { stock: stock });
  }
}
