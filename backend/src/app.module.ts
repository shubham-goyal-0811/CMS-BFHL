import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    // Load environment variables from .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Connect to MongoDB
    MongooseModule.forRoot(process.env.MONGO_URI!),

    // User-related features
    UsersModule,
    AuthModule,
    ProductsModule
  ],
})
export class AppModule {}
