import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import preChargeData from '../../helpers/Archivo actividad 3.json';
import { isUUID } from 'class-validator';
import { CreateProductDto } from 'src/dtos/createProduct.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateProductDto } from 'src/dtos/updateProduct.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from '../Users/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  async onModuleInit() {
    await this.addPreChargedProducts();
  }
  //***********************************************************************************
  @Get('seeder')
  addPreChargedProducts() {
    return this.productsService.addPreChargedProducts(preChargeData);
  }
  //***********************************************************************************
  @HttpCode(200)
  @Get()
  getProducts(@Query('page') page?: string, @Query('limit') limit?: string) {
    let nPage = Number(page);
    let nLimit = Number(limit);
    if (!nPage || nPage === 0) nPage = 1;
    if (!nLimit || nLimit === 0) nLimit = 5;
    return this.productsService.getProducts(nPage, nLimit);
  }
  //***********************************************************************************
  @HttpCode(200)
  @Get(':id')
  getProductsById(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return this.productsService.getProductsById(id);
  }
  //************************************************************************************
  @ApiBearerAuth()
  @HttpCode(201)
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin) //It has got to be an admin to access this route
  createProduct(@Body() product: CreateProductDto) {
    return this.productsService.createProduct(product);
  }
  //************************************************************************************
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  @Roles(Role.Admin) //It has got to be an admin to access this route
  updateProduct(@Param('id') id: string, @Body() product: UpdateProductDto) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return this.productsService.updateProduct(id, product);
  }
  //*************************************************************************************
  @HttpCode(200)
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return this.productsService.deleteProduct(id);
  }
}
