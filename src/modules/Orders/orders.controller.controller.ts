import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from 'src/dtos/order.dto';
import { isUUID } from 'class-validator';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  //************************************************************************************
  @Get()
  getOrders() {
    return this.ordersService.getOrders();
  }
  //************************************************************************************
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  addOrder(@Body() order: CreateOrderDto) {
    if(!isUUID(order.userId)){
      throw new BadRequestException('Invalid UUID format');
    }
    return this.ordersService.addOrder(order);
  }
  //************************************************************************************
  // @ApiBearerAuth()
  // @Get(':id')
  // @UseGuards(AuthGuard)
  // getOrderById(@Param('id') id: string) {
  //   if (!isUUID(id)) {
  //     throw new BadRequestException('Invalid UUID format');
  //   }
  //   return this.ordersService.getOrderById(id);
  // }
  //************************************************************************************
}
