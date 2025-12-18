import { IsString, IsOptional } from 'class-validator';

export class CreateServiceCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;
}