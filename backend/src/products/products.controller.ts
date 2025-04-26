import {
  Controller, Post, Body, UseGuards, UploadedFile, UseInterceptors, Get, Param, Patch,
  Delete
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { AdminGuard } from '../guards/roles.guard';
import cloudinary from '../utils/cloudinary';
import { UpdateProductDto } from './dtos/update-product.dto';
import {Express} from 'express';
import { unlink } from 'fs/promises';
import { multerOptions } from 'src/uploads/multer.config';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image',multerOptions))
  async createProduct(
    @UploadedFile() image: Express.Multer.File,
    @Body() productDto: CreateProductDto,
  ) {
    let imageUrl: string | undefined;
    
  if (image) {    
    imageUrl = await this.productsService.uploadToCloudinaryAndDeleteLocal(image.path);
  }

  // Assign imageUrl to productDto
  if (imageUrl) {
    productDto.imageUrl = imageUrl;
  }

  // Create the product with the updated productDto
  return this.productsService.create({ ...productDto, imageUrl });
  }

  @Get()
  async getAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Delete(':id')
@UseGuards(AdminGuard)
async deleteProduct(@Param('id') id: string) {
  return this.productsService.delete(id);
}


  @Patch(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image',multerOptions))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      if (image) {
        const uploaded = await cloudinary.uploader.upload(image.path, {
          folder: 'products',
        });
        dto.imageUrl = uploaded.secure_url;
      }
  
      return this.productsService.update(id, dto);
    } finally {
      if (image) {
        try {
          await unlink(image.path);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
}
