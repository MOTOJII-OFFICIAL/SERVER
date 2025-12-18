import { IsOptional, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offset: number;

  @IsOptional()
  @IsString()
  keyword?: string;
}