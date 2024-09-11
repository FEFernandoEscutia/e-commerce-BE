import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './categories.repository';
import { Category } from 'src/entities/categories.entity';
import { ProductDto } from 'src/dtos/product.dto';


@Injectable()
export class SeederCategoriesService {
  constructor(
    private categoryRepository: CategoryRepository,
  ) {}
//**************************************************************** 
  async preChargePD(preChargeData: ProductDto[]) {

    const categories = preChargeData.map((product)=>{
      return product.category
    })
    
    for (const category of categories ){
      const newCategory = {
        name:category,
        products:[]
      } as Partial<Category>
      await this.categoryRepository.addCategories(newCategory)
    }
    return this.categoryRepository.getCategories()
  }

  //****************************************************************
}


