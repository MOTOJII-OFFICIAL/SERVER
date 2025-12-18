import { IsString, IsOptional } from 'class-validator';

export class CreatePartsOrderDto {
  @IsOptional()
  @IsString()
  shippingAddress?: string;
}