import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { isUUID } from 'class-validator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from './role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/dtos/updateUser.dto';

@ApiTags('users')
@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
  constructor(private readonly userService: UsersService) {}
 //****************************************************************************************************
 @ApiBearerAuth()
  @HttpCode(200)
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)   //It has got to be an admin to access this route
  getUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ) {
    const nPage = Number(page) || 1;
    const nLimit = Number(limit) || 5;
    return this.userService.getUsers(nPage, nLimit);
  }
 //****************************************************************************************************
 @ApiBearerAuth()
  @HttpCode(200)
  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getUserById(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    return await this.userService.getUsersById(id);
  }
 //****************************************************************************************************
 @ApiBearerAuth()
  @HttpCode(200)
  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User) 
  @ApiOperation({
    summary: 'Update user profile',
    description: `Admins can update any user's information, including admin privileges, and can specify the user ID in the parameter.
                  Regular users can only update their own profile, and their ID is automatically set.`,
  })
  updateUser(@Body() user: UpdateUserDto, @Param('id') id: string,  @Req() req: any) {
    const currentUser = req.user;
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    if (currentUser.roles.includes(Role.Admin)) {
     
      
      return this.userService.updateSpecialUser(user, id); 
    }
    if (currentUser.roles.includes(Role.User)) {
      const currentUserId = currentUser.id
      
      return this.userService.updateUser(user,currentUserId); 
    }
  }
 //****************************************************************************************************
 @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteUserById(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return this.userService.deleteUserById(id);
  }
}
