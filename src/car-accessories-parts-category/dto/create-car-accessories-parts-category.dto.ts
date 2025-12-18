import { IsString, IsOptional } from 'class-validator';

export class CreateCarAccessoriesPartsCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}