import cloudinary from '../utils/cloudinary';
import { unlink } from 'fs/promises';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './products.schema';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async create(dto: CreateProductDto & { imageUrl?: string }) {
    // Handle the creation logic, ensuring imageUrl is correctly passed
    return this.productModel.create(dto);
  }
  

  async findAll() {
    return this.productModel.find();
  }

  async findById(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const updated = await this.productModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  async delete(id : string){
    const deleted = await this.productModel.findByIdAndDelete(id);
  if (!deleted) {
    throw new NotFoundException('Product not found');
  }
  return { message: 'Product deleted successfully' };
  }

  async uploadToCloudinaryAndDeleteLocal(filePath: string) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'products',
      });
      
      return result.secure_url;
    } catch (error) {
      console.log(error);
      throw new Error('Cloudinary upload failed');
    }
    finally{
      if (filePath) {
        try {
          await unlink(filePath);
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      }
    }
  }
}
