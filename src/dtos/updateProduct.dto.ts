import { PickType } from "@nestjs/swagger";
import { ProductDto } from "./product.dto";


export class UpdateProductDto extends PickType(ProductDto, ["description","price", "imgUrl", "stock" ]) {}