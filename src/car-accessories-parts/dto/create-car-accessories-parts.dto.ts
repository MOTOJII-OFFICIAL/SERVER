import { IsString, IsNumber, IsOptional, IsUUID, IsInt, Min } from 'class-validator';

export class CreateCarAccessoriesPartsDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stockQuantity: number;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  partNumber?: string;

  @IsUUID()
  categoryId: string;
}