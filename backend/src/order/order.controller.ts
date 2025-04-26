import { Controller, Post, Get, Param, Req, UseGuards, Patch, Body, BadRequestException } from '@nestjs/common';
import { OrderService } from './order.service';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AdminGuard } from 'src/guards/roles.guard';
import { Status } from './order.schema';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('place')
  async placeOrder(@Req() req) {
    const userId = req.user.userId; 
    return this.orderService.placeOrder(userId);
  }

  @Get('my-orders')
  async getMyOrders(@Req() req) {
    const userId = req.user.userId;
    return this.orderService.getUserOrders(userId);
  }

  @Get(':id')
  async getOrderById(@Param('id') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }

  @UseGuards(AdminGuard)
  @Get()
  async getAllOrders(){
    return this.orderService.getAll();
  }

  @UseGuards(AdminGuard)
  @Patch()
  async updateStatus(
    @Body('orderid') orderId : string,
    @Body('status') status : string){

      if (!Object.values(Status).includes(status as Status)) {
        throw new BadRequestException('Invalid status value');
      }

      return this.orderService.updateState(orderId,status);
  }
}
