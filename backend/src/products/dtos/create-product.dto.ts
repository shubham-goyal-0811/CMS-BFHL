import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductCategory } from '../products.schema';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  cost: number;

  @IsNumber() 
  quantity: number;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsOptional()
  imageUrl?: string;
}
