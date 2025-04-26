import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cart } from "./cart.schema";
import { Product } from "src/products/products.schema";
import { Model, Types } from "mongoose";

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async addToCart(userId: string, productId: string, quantity = 1) {
    let cart = await this.cartModel.findOne({ userId });

    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    const productCost = product.cost * quantity;

    if (!cart) {
      cart = await this.cartModel.create({
        userId,
        items: [{ productId, quantity }],
        totalBill: productCost,
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId : new Types.ObjectId(productId), quantity });
      }

      cart.totalBill += productCost;
      await cart.save();
    }

    return cart;
  }

  async getCart(userId: string) {
    return this.cartModel.findOne({ userId }).populate('items.productId');
  }

  async removeItemFromCart(userId: string, productId: string) {
    const cart = await this.cartModel.findOne({ userId });
  
    if (!cart) throw new NotFoundException('Cart not found');
  
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return 'Product not in cart';
    }
  
    const currentItem = cart.items[itemIndex];
  
    // Decrease the quantity
    currentItem.quantity -= 1;
  
    // If quantity becomes 0 or less, remove the item from the cart
    if (currentItem.quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    }
  
    // Recalculate the total bill
    cart.totalBill = 0; // Reset the total bill to ensure it's recalculated correctly
  
    for (const item of cart.items) {
      const product = await this.productModel.findById(item.productId); // Await the product query
      if (product) {
        cart.totalBill += (product.cost ?? 0) * item.quantity; // Safely use product cost
      }
    }
  
    await cart.save();
    return 'Item removed and total bill updated';
  }
  
}
