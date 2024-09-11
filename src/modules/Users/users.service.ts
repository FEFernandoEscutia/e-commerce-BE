import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.respository';
import { CreateUserDto } from 'src/dtos/createUserDto';
import { AuthDto } from 'src/dtos/logInUser.dto';
import * as bcrypt from 'bcrypt';
import {  UpdateUserDto } from 'src/dtos/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}
  //****************************************************************************************************
  async getUsers(nPage: number, nLimit: number) {
    const users = await this.userRepository.findAllUsers();
    return users.slice((nPage - 1) * nLimit, nPage * nLimit);
  }
  //****************************************************************************************************
  async getUsersById(id: string) {
    const user = await this.userRepository.findUserWId(id);
    const { password, isAdmin, ...returnableUserInfo } = user;
    return returnableUserInfo;
  }
  //****************************************************************************************************
  async signUp(user: CreateUserDto) {
    const dbUser = await this.userRepository.findUserWithEmail(user.email);

    if (dbUser) {
      throw new ConflictException('The email is already registered');
    }
    const hashPassword = await bcrypt.hash(user.password, 10);
    if (!hashPassword) {
      throw new BadRequestException('password was not hashed correctly');
    }
    const newUser: CreateUserDto = { ...user, password: hashPassword };

    return this.userRepository.signUp(newUser);
  }
  //****************************************************************************************************
  async updateUser(newUserInfo: UpdateUserDto, currentUserId: string) {
    const dbUser = await this.userRepository.findUserWId(currentUserId);
      
    return this.userRepository.updateUser(dbUser, newUserInfo);
  }
  //****************************************************************************************************
  async updateSpecialUser(user: UpdateUserDto, id: string) {
    const dbUser = await this.userRepository.findUserWId(id);
    if (!dbUser) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.updateSpecialUser(user, dbUser);
  }
  //****************************************************************************************************
  async signIn(userCred: AuthDto) {

      const dbUser = await this.userRepository.findUserWithEmail(userCred.email);
      if (!dbUser) {
        throw new BadRequestException('Invalid username or password');
      }
      const isPasswordValid = await bcrypt.compare(
        userCred.password,
        dbUser.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid username or password');
      }
      return this.userRepository.signIn(dbUser);
   
  }
  //****************************************************************************************************
  async deleteUserById(id: string) {
    const dbUser = await this.userRepository.findUserWId(id);
    if (!dbUser) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.deleteUserById(dbUser);
  }
}
