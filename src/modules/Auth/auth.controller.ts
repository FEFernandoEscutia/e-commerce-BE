import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthDto } from 'src/dtos/logInUser.dto';
import { UsersService } from '../Users/users.service';
import { CreateUserDto } from 'src/dtos/createUserDto';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
  //************************************************************************************
  @Post('signup')
  logIn(@Body() user: CreateUserDto) {
    return this.userService.signUp(user);
  }
  //************************************************************************************
  @Post('signIn')
  signIn(@Body() userCred: AuthDto) {
    return this.userService.signIn(userCred);
  }
  //************************************************************************************
  @Get('validation')
  async validateUser(@Req() req: Request, @Res() res: Response) {
    if (!req.oidc.isAuthenticated()) {
      return res.status(401).send('Authentication required');
    }

    const auth0User = req.oidc.user;

    const dbUser = await this.authService.validateUserInDatabase(
      auth0User.email,
    );

    if (!dbUser) {
      return res.status(404).send('User not found in the database');
    }
    const userPayload = {
      sub: dbUser.id,
      id: dbUser.id,
      email: dbUser.email,
    };
    const token = this.jwtService.sign(userPayload);

    return res.json({
      message: 'User is authenticated and validated in the database',
      token,
    });
  }
  //************************************************************************************
}
