import { IsEnum, IsString, IsInt, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { VehicleCategory, CarType } from 'src/enum';

export class CreateVehicleDto {
  @IsEnum(VehicleCategory)
  category: VehicleCategory;

  @IsOptional()
  @IsEnum(CarType)
  carType?: CarType;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsInt()
  @Min(1990)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  plateNumber?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}