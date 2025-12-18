import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from 'src/enum';

export class SearchProvidersDto {
  @IsNumber()
  @Type(() => Number)
  lat: number;

  @IsNumber()
  @Type(() => Number)
  lng: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  radius?: number = 10;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}