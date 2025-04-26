import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  FURNITURE = 'furniture',
  PERFUMES = 'perfumes',
}

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  cost: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true, enum: ProductCategory })
  category: ProductCategory;

  @Prop() // optional
  imageUrl?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
