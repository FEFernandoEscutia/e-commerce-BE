import { ConflictException, Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Product } from 'src/entities/products.entity';
import { ProductDto } from 'src/dtos/product.dto';
import { CreateProductDto } from 'src/dtos/createProduct.dto';
import { UpdateProductDto } from 'src/dtos/updateProduct.dto';
import { CategoryRepository } from '../Categories/categories.repository';

@Injectable()
export class ProductsService {
  constructor(private productsRepository: ProductsRepository,
    private readonly categoryRepository:CategoryRepository
  ) {}
//***********************************************************************************
  async addPreChargedProducts(preChargeData: ProductDto[]) {
    const categories = await this.productsRepository.getCategories();
    const uniqueProducts = preChargeData.map((product) => {
      const matchingCategory = categories.find(
        (category) => category.name === product.category,
      );
      return {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock ?? 0,
        imgUrl: product.imgUrl,
        category: matchingCategory,
        orderDetails: [],
      } as Partial<Product>;
    });

    await this.productsRepository.addProducts(uniqueProducts);
    
    return {message:"pre charge has bee done correctly"};
  }
//***********************************************************************************
  async getProducts(nPage: number, nLimit: number) {
    const products = await this.productsRepository.getAllProducts()
    return products.slice((nPage - 1) * nLimit, nPage * nLimit);
  }
//***********************************************************************************
  async getProductsById(id: string) {
    const dbProduct =  await this.productsRepository.findProductById(id);
    const {orderDetails, ...properties} = dbProduct
    return properties
  }
//***********************************************************************************
  async createProduct(product: CreateProductDto) {
    const dbProduct = await this.productsRepository.findProductByName(product.name)
    if (dbProduct) {
      throw new ConflictException('Product already exist');
    }
    let dbCategory = await this.categoryRepository.getCategoriesByName(product.category); /// It has got to be like that because it has to change to be updated
    if (!dbCategory) {
      await this.categoryRepository.createCategory(product.category);
      dbCategory = await this.categoryRepository.getCategoriesByName(product.category);  
    }
    
    return await this.productsRepository.createProduct(product, dbCategory);
  }
//***********************************************************************************
async updateProduct(id: string, product : UpdateProductDto) {
    const dbProduct = await this.productsRepository.findProductById(id)
    if (!dbProduct) {
      throw new ConflictException('Product does not exist');
    } 
    return this.productsRepository.updateProduct( product, dbProduct)
  }
  //***********************************************************************************
  async deleteProduct(id: string) {
  const dbProduct = await this.productsRepository.findProductById(id)
    if (!dbProduct) {
      throw new ConflictException('Product does not exist');
    } 
    return this.productsRepository.deleteProduct(dbProduct)
  } 
  //***********************************************************************************
}
