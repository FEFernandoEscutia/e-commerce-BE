import { PartialType, PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./createUserDto";


export class UpdateUserDto extends PartialType(CreateUserDto){}