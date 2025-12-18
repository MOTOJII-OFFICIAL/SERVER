import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class ApplyCouponDto {
  @IsString()
  couponCode: string;

  @IsNumber()
  @Min(0)
  orderAmount: number;

  @IsOptional()
  @IsString()
  orderType?: string; // 'service' or 'parts'
}