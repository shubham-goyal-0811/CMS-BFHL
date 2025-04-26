// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // Importing JwtModule
import { UsersModule } from '../users/users.module'; // Import UsersModule here
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule, // Add UsersModule to imports
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use a real secret key in production
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports : [JwtModule]
})
export class AuthModule {}
