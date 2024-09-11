import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { User } from "src/entities/users.entity";
import { Repository } from "typeorm";
import { UsersRepository } from "../Users/users.respository";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class AuthService {
    
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>) {}

        async validateUserInDatabase(email: string): Promise<User | undefined> {
            return this.usersRepository.findOne({where:{email:email}});
          }

      async handleSignIn(req: Request, res: Response) {
        if (!req.oidc.isAuthenticated()) {
          return res.status(401).send('Authentication required');
        }
    
        const user = req.oidc.user;
        console.log(user);
        return res.json({
          message: 'Successfully authenticated with Auth0',
          user,
        });
      }
}