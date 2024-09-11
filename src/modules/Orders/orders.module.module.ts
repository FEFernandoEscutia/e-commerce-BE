import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller.controller';
import { OrdersRepository } from './orders.respository';
import { Order } from 'src/entities/orders.entity';
import { OrderDetail } from 'src/entities/orderDetails.entity';
import { Product } from 'src/entities/products.entity';
import { User } from 'src/entities/users.entity';
import { UsersRepository } from '../Users/users.respository';
import { ProductsRepository } from '../Products/products.repository';
import { Category } from 'src/entities/categories.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderDetail, Product, User, Category])],
    providers:[OrdersService, OrdersRepository, UsersRepository, ProductsRepository],
    controllers: [OrdersController],
})
export class OrdersModule {}
