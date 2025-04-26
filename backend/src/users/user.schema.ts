// src/users/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document{
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true, lowercase: true, index : true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique : true, index : true })
  mobileNumber: string;

  @Prop({ required: true })
  address: string;

  @Prop({default : 'User'})
  role : string

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }])
  orderIds: mongoose.Types.ObjectId[];

}

export const UserSchema = SchemaFactory.createForClass(User);
