import { Module } from "@nestjs/common";
import { SeederCategoriesService } from "./categories.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "src/entities/categories.entity";
import { SeederCategoriesController } from "./categories.controller";
import { CategoryRepository } from "./categories.repository";
import { Product } from "src/entities/products.entity";




@Module({
    imports: [TypeOrmModule.forFeature([Product, Category])],
    providers:[SeederCategoriesService, CategoryRepository ],
    controllers:[SeederCategoriesController]
})
export class categoryModule{}