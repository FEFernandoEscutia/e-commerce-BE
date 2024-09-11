import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1] ?? '';
    if (!token) {
      throw new UnauthorizedException('Bearer token not found');
    }
    try {
      const secret = process.env.JWT_SECRET;
      const payload = await this.jwtService.verifyAsync(token, { secret });
      payload.iat = dayjs.unix(payload.iat).format('YYYY-MM-DD HH:mm:ss');
      payload.exp = dayjs.unix(payload.exp).format('YYYY-MM-DD HH:mm:ss');
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
