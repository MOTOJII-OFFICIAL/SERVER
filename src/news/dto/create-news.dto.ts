import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  heading: string;

  @IsOptional()
  @IsString()
  subHeading?: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}