import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './createUserDto';

export class AuthDto extends PickType(CreateUserDto, ['email', 'password']) {}
