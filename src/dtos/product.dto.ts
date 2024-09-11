import { PickType } from '@nestjs/swagger';

import { CreateProductDto } from './createProduct.dto';

export class ProductDto extends PickType(CreateProductDto, [
  'name',
  'description',
  'price',
  'stock',
  'imgUrl',
  'category',
]) {}
