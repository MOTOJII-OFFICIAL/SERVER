import { IsString, IsNumber, IsUUID, IsOptional, IsArray, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsNumber()
  @Min(1)
  durationMinutes: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsUUID()
  serviceCategoryId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  vehicleCategoryIds: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  carTypeIds?: string[];
}