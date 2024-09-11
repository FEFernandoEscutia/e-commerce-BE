import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './orders.entity';
@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  phone: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable:true
  })
  country: string;

  @Column({
    type: 'varchar',
    nullable:true
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable:true
  })
  city: string;

  @Column({
    type: 'boolean',
    default:false
  })
  isAdmin: boolean;

  @OneToMany(() => Order, (order) => order.user)
  @JoinColumn({ name: 'user_id' }) 
  orders: Order[];
}
