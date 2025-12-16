import { IsString, IsEmail, IsOptional, IsEnum, Length } from 'class-validator';
import { UserRole } from 'src/enum';

export class CreateAccountDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  username: string;

  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(10, 20)
  phone: string;

  @IsEmail()
  @Length(1, 100)
  email: string;

  @IsString()
  @Length(6, 255)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  userRole: UserRole;
}
