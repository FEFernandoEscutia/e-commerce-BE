import { Controller, Get, Post } from '@nestjs/common';
import preChargeData from '../../helpers/Archivo actividad 3.json';
import { SeederCategoriesService } from './categories.service';
import { ProductDto } from 'src/dtos/product.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class SeederCategoriesController {
  constructor(private readonly categoryService: SeederCategoriesService) {}

  async onModuleInit() {
    await this.preChargePD();
  }
  //*****************************************************************************
  @Get('seeder')
  preChargePD() {
    return this.categoryService.preChargePD(preChargeData as ProductDto[]);
  }
  //****************************************************************************
}
