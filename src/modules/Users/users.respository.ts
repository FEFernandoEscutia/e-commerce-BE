import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/dtos/createUserDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from './role.enum';
import { UpdateUserDto } from 'src/dtos/updateUser.dto';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env.development' });
@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const adminUser = new User();
    const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    adminUser.name = 'MainAdmin';
    adminUser.phone = 0;
    adminUser.password = hashPassword;
    adminUser.email = process.env.ADMIN_EMAIL;
    adminUser.isAdmin = true;
    const fAU = await this.findUserWithEmail(adminUser.email);
    if (fAU) {
      return console.log('first main user already exist');
    }
    this.userRepository.create(adminUser);
    await this.userRepository.save(adminUser);
    return console.log("1st Main user created successfully");
    
  }
  //****************************************************************************************************
  async findAllUsers() {
    return await this.userRepository.find();
  }
  //****************************************************************************************************
  async findUserWithEmail(email: string) {
    return await this.userRepository.findOne({ where: { email: email } });
  }
  //****************************************************************************************************
  async findUserWId(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['orders'],
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }
  //****************************************************************************************************
  async signUp(newUser: CreateUserDto) {
    try {
      const createdUser = this.userRepository.create(newUser);
      await this.userRepository.save(createdUser);
      const { password, isAdmin, ...userWithoutSensitiveInfo } = createdUser;
      return { message: 'User created successfully', userWithoutSensitiveInfo };
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException('Failed to create the user');
    }
  }
  //****************************************************************************************************
  async updateUser(dbUser: User, newUserInfo: UpdateUserDto) {
    try {
      let { isAdmin, ...updatedUserInfo } = newUserInfo;
      if (newUserInfo.password) {
        const hashPassword = await bcrypt.hash(newUserInfo.password, 10);
        updatedUserInfo.password = hashPassword;
      }
      await this.userRepository.update(dbUser.id, updatedUserInfo);
      return this.findUserWId(dbUser.id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update the user');
    }
  }
  //****************************************************************************************************
  async updateSpecialUser(user: UpdateUserDto, dbUser: User) {
    try {
      let { ...updatedUserInfo } = user;
      if (user.password) {
        const hashPassword = await bcrypt.hash(user.password, 10);
        updatedUserInfo.password = hashPassword;
      }
      await this.userRepository.update(dbUser.id, updatedUserInfo);

      return this.findUserWId(dbUser.id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update the user');
    }
  }
  //****************************************************************************************************
  async signIn(dbUser: User) {
    const userPayload = {
      sub: dbUser.id,
      id: dbUser.id,
      email: dbUser.email,
      roles: [dbUser.isAdmin ? Role.Admin : Role.User],
    };
    const token = this.jwtService.sign(userPayload);
    return { message: `welcome in ${dbUser.name}`, token };
  }
  //****************************************************************************************************
  async deleteUserById(dbUser: User) {
    await this.userRepository.remove(dbUser);

    return { message: 'User has been successfully deleted' };
  }
  //****************************************************************************************************
}
