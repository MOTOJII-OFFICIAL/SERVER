import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { AdminLoginDto, UserLoginDto, LoginIdDto, RegisterDto, VerifyRegistrationDto, ResendOtpDto, RefreshTokenDto, LogoutDto } from './dto/login.dto';

@Controller('auth')
@Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute for auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/send-otp')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 OTP requests per minute
  sendAdminOtp(@Body() dto: LoginIdDto) {
    return this.authService.sendAdminOtp(dto.loginId);
  }

  @Post('admin/login')
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 login attempts per 5 minutes
  adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto.loginId, dto.otp);
  }

  @Post('user/send-otp')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 OTP requests per minute
  sendUserOtp(@Body() dto: LoginIdDto) {
    return this.authService.sendUserOtp(dto.loginId);
  }

  @Post('user/login')
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 login attempts per 5 minutes
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