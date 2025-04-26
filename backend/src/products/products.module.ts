// products.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './products.schema'
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule,MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports : [
    ProductsService,
    MongooseModule
  ]
})
export class ProductsModule {}
