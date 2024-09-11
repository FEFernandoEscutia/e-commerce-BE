import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';
import { OrderDetail } from './orderDetails.entity';

@Entity({
  name: 'orders',
})
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' }) 
  user: User;

  @Column()
  date: Date;

  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order)
  @JoinColumn({ name: 'order_id' })
  orderDetail: OrderDetail;
}
