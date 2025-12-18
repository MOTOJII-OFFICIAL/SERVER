import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateFAQDto {
  @IsString()
  question: string;

  @IsString()
  answer: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}