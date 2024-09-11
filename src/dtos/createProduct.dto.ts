import { ApiProperty } from '@nestjs/swagger';
import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @ApiProperty({
    description: "The unique name of the product, limited to 50 characters.",
    example: "Wireless Gaming Mouse",
  })
  @IsString()
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    description: "A brief description of the product, explaining its features.",
    example: "High-performance wireless gaming mouse with customizable DPI settings.",
  })
  @IsString()
  description: string;

  @IsNotEmpty()
  @ApiProperty({
    description: "The price of the product, with up to 2 decimal places.",
    example: 35.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @IsNotEmpty()
  @ApiProperty({
    description: "The current stock level of the product, represented as a whole number.",
    example: 150,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  stock: number;

  @IsOptional()
  @ApiProperty({
    description: "An optional image URL representing the product.",
    example: "https://agrimart.in/index.php/home/vendor_profile/get_slider/",
    default: "https://agrimart.in/index.php/home/vendor_profile/get_slider/",
  })
  @IsString()
  imgUrl?: string;

  @IsNotEmpty()
  @ApiProperty({
    description: "The category to which the product belongs, referenced by name.",
    example: "mouse",
  })
  @IsString()
  category: string;
}
