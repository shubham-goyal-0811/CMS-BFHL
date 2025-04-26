import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['access_token'];

    if (!token) {
      throw new ForbiddenException('No token found. Access denied.');
    }

    try {
      const decoded: any = await this.jwtService.verify(token,{secret: process.env.JWT_SECRET});

      if (decoded.role !== 'admin') {
        throw new ForbiddenException('Only admin can access this route.');
      }

      // You can optionally attach user to request for further use
      request['user'] = decoded;

      return true;
    } catch (err) {
      console.log(err)
      throw new ForbiddenException('Invalid or expired token.');
    }
  }
}
