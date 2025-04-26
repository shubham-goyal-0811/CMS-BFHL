import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { CartService } from "./cart.service";

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addToCart(
    @Req() req,
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
   
    const userId = req.user.userId; // assuming jwt gives this
    return this.cartService.addToCart(userId, productId, quantity);
  }

  @Get()
  async getCart(@Req() req) {
    const userId = req.user.userId;
    return this.cartService.getCart(userId);
  }

  @Patch(':productId')
  async removeFromCart(@Req() req, @Param('productId') productId: string) {
    const userId = req.user.userId;
    return this.cartService.removeItemFromCart(userId, productId);
  }
}
