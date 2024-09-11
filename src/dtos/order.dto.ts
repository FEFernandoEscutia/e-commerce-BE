import { IsNotEmpty, IsUUID, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { Product } from 'src/entities/products.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'The UUID of the user placing the order.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;

  @IsNotEmpty({ message: 'Products cannot be empty.' })
  @ArrayMinSize(1)
  @Type(() => Product)
  @ApiProperty({
    description: 'An array of unique products included in the order. Each product should have a valid and unique ID (UUID).',
    example: [
      { id: '123e4567-e89b-12d3-a456-426614174000' },
      { id: '123e4567-e89b-12d3-a456-426614174001' }
    ]
  })
  products: Array< Partial<Product>>;
}

// export class OrderDto {
//   userId: string;
//   products: Array<{ productId: string }>;
// }
