import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { CreateOrderDto } from 'src/dtos/order.dto';
import { OrderDetail } from 'src/entities/orderDetails.entity';
import { Order } from 'src/entities/orders.entity';
import { Product } from 'src/entities/products.entity';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
  ) {}

  async getAllOrders() {
    return this.ordersRepository.find({
      relations: ['orderDetail'],
    });
  }

  async createOrder(total: number, products: Product[], user: User) {

    const newOrderDetail = new OrderDetail();
    newOrderDetail.price = total;
    newOrderDetail.products = products;
    await this.orderDetailRepository.save(newOrderDetail);

    const newOrder = new Order();
    newOrder.user = user;
    newOrder.date = new Date();
    newOrder.orderDetail = newOrderDetail;
    await this.ordersRepository.save(newOrder);

    await this.orderDetailRepository.update(newOrderDetail.id, {
      order: newOrder,
    });
    const showIOorder = {
      orderId: newOrder.id,
      price: newOrder.orderDetail.price,
      orderDetailId: newOrder.orderDetail.id,
    };
    return { message: 'Order created correctly', showIOorder };
  }

  async getOrderById(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const order = await this.ordersRepository.findOne({
      where: { id: id },
      relations: ['orderDetail.products', 'user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    const orderResponse = {
      orderId: order.id,
      date: order.date,
      userName: order.user.name,
      totalAmount: order.orderDetail.price,
      products: order.orderDetail.products.map((product) => ({
        productId: product.id,
        name: product.name,
      })),
    };

    return orderResponse;
  }
}
