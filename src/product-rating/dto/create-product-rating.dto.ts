import { IsUUID, IsInt, Min, Max, IsOptional, IsString } from 'class-validator';

export class CreateProductRatingDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  review?: string;
}