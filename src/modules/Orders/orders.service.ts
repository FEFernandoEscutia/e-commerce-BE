import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrdersRepository } from './orders.respository';
import { CreateOrderDto } from 'src/dtos/order.dto';
import { UsersRepository } from '../Users/users.respository';
import { isUUID } from 'class-validator';
import { ProductsRepository } from '../Products/products.repository';
import { OrderDetail } from 'src/entities/orderDetails.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly userRepository: UsersRepository,
    private readonly productRepository: ProductsRepository,
  ) {}
  //************************************************************************************
  getOrders() {
    return this.ordersRepository.getAllOrders();
  }
  //************************************************************************************
  async addOrder(order: CreateOrderDto) {
    const dbUser = await this.userRepository.findUserWId(order.userId);
    if (!dbUser) {
      throw new NotFoundException('User not found');
    }
    let total = 0;
    const products = [];
    for (const productItem of order.products) {
      if (!isUUID(productItem.id)) {
        throw new BadRequestException(
          `Invalid UUID format for Product ID ${productItem.id}`,
        );
      }
      const dbProduct = await this.productRepository.findProductById(
        productItem.id,
      );
      if (!dbProduct) {
        throw new NotFoundException(
          `Product with ID ${productItem.id} not found`,
        );
      }
      if (dbProduct.stock === 0) {
        throw new ConflictException(
          `Product with ID ${productItem.id} is out of stock`,
        );
      }
      if (dbProduct && dbProduct.stock > 0) {
        dbProduct.stock -= 1;
        this.productRepository.upProductAOrder(dbProduct.id, dbProduct.stock);
        total += Number(dbProduct.price);
        products.push(dbProduct);
      }
      return this.ordersRepository.createOrder(total, products, dbUser);
    }
  }
  //************************************************************************************
  getOrderById(id: string) {
    return this.ordersRepository.getOrderById(id);
  }
  //************************************************************************************
}
