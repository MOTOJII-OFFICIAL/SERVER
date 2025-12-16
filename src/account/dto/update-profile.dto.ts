import { IsOptional, IsString, IsEmail, Length } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  username: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  @Length(10, 20)
  phone: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 100)
  email: string;
}