import { IsUUID, IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  partId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}