import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.schema';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Cart, CartSchema } from 'src/cart/cart.schema';
import { Product, ProductSchema } from '../products/products.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { User, UserSchema } from 'src/users/user.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema }
    ]),
    UsersModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports : [MongooseModule]
})
export class OrderModule {}
