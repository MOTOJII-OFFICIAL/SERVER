import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { UserRole, OtpType } from 'src/enum';

export class LoginIdDto {
  @IsNotEmpty()
  @IsString()
  loginId: string; // email or phone number
}

export class AdminLoginDto extends LoginIdDto {
  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class UserLoginDto extends LoginIdDto {
  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsEnum([UserRole.USER, UserRole.MECANIC, UserRole.VENDOR, UserRole.TOWING_PROVIDER, UserRole.CAR_DETAILER])
  role: UserRole;
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class VerifyRegistrationDto extends LoginIdDto {
  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class ResendOtpDto extends LoginIdDto {
  @IsEnum(OtpType)
  type: OtpType;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class LogoutDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}