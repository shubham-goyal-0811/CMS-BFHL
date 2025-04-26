import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export enum Status {
  PENDING = 'pending',
  PROCESSING = 'in process',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export type OrderDocument = Order & Document;

@Schema()
export class Order extends Document{
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop([
    {
      productId: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      cost: { type: Number, required: true },
    },
  ])
  items: {
    productId: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    cost: number;
  }[];

  @Prop({ required: true })
  totalBill: number;

  @Prop({ default: 'pending' , enum : Status })
  status: Status;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
