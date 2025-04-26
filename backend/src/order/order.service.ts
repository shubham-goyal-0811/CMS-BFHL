import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, Status } from './order.schema';
import { Cart, CartDocument } from '../cart/cart.schema';
import { Product, ProductDocument } from '../products/products.schema';
import { User, UserDocument } from 'src/users/user.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async placeOrder(userId: string) {
    const cart = await this.cartModel.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty. Cannot place order.');
    }

    let finalTotalBill = 0;
    const finalItems: {
      productId: any;
      name: string;
      quantity: number;
      cost: number;
    }[] = [];

    for (const item of cart.items) {
      const product = await this.productModel.findById(item.productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }
      finalItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        cost: product.cost,
      });
      finalTotalBill += (product.cost ?? 0) * item.quantity;
    }

    const newOrder = new this.orderModel({
      userId,
      items: finalItems,
      totalBill: finalTotalBill,
      status: 'pending',
    });

    await newOrder.save();

    await this.userModel.findByIdAndUpdate(
      newOrder.userId,
      { $push: { orderIds: newOrder._id } },
      { new: true }
    );

    // Clear cart
    cart.items = [];
    cart.totalBill = 0;
    await cart.save();

    return { message: 'Order placed successfully', orderId: newOrder._id };
  }

  async getUserOrders(userId: string) {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 });
  }

  async getOrderById(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getAll(){
    return await this.orderModel.find();
  }

  async updateState(orderId : string, status : string){
    const order = await this.orderModel.findById(orderId);
    
    if(!order){
      throw new NotFoundException('Order not found');
    }
    order.status = status as Status;
    await order.save();

    return order;
  }
}
