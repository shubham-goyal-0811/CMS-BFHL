import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './cart.schema';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    AuthModule, 
    ProductsModule,
    UsersModule
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
