import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginDto, UserLoginDto, LoginIdDto, RegisterDto, VerifyRegistrationDto, ResendOtpDto, RefreshTokenDto, LogoutDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/send-otp')
  sendAdminOtp(@Body() dto: LoginIdDto) {
    return this.authService.sendAdminOtp(dto.loginId);
  }

  @Post('admin/login')
  adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto.loginId, dto.otp);
  }

  @Post('user/send-otp')
  sendUserOtp(@Body() dto: LoginIdDto) {
    return this.authService.sendUserOtp(dto.loginId);
  }

  @Post('user/login')
  userLogin(@Body() dto: UserLoginDto) {
    return this.authService.userLogin(dto.loginId, dto.otp, dto.role);
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.phoneNumber, dto.name, dto.password);
  }

  @Post('verify-registration')
  verifyRegistration(@Body() dto: VerifyRegistrationDto) {
    return this.authService.verifyRegistrationOtp(dto.loginId, dto.otp);
  }

  @Post('resend-otp')
  resendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto.loginId, dto.type);
  }

  @Post('refresh-token')
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  logout(@Body() dto: LogoutDto) {
    return this.authService.logout(dto.refreshToken);
  }
}