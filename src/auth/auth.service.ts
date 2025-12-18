import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Account } from 'src/account/entities/account.entity';
import { UserPermission } from 'src/user-permissions/entities/user-permission.entity';
import { Session } from './entities/session.entity';
import { UserRole, OtpType } from 'src/enum';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { OnboardingTrackingService } from 'src/onboarding-tracking/onboarding-tracking.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Account) private readonly repo: Repository<Account>,
    @InjectRepository(UserPermission) private readonly upRepo: Repository<UserPermission>,
    @InjectRepository(Session) private readonly sessionRepo: Repository<Session>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private emailService: EmailService,
    private onboardingService: OnboardingTrackingService,
  ) { }

  async sendAdminOtp(loginId: string) {
    const admin = await this.findUserByLoginId(loginId, UserRole.ADMIN);
    const otp = this.generateOtp();

    await this.cacheManager.set(`admin_otp_${admin.id}`, otp, 10 * 60 * 1000);
    await this.cacheManager.del(`admin_otp_attempts_${admin.id}`);
    
    await this.emailService.sendOTP(admin.email, otp, OtpType.ADMIN);

    return { message: 'OTP sent successfully' };
  }

  async adminLogin(loginId: string, otp: string) {
    const admin = await this.findUserByLoginId(loginId, UserRole.ADMIN);
    const attemptKey = `admin_otp_attempts_${admin.id}`;
    const attempts = await this.cacheManager.get<number>(attemptKey) || 0;

    if (attempts >= 3) {
      throw new BadRequestException('Too many OTP attempts. Request new OTP.');
    }

    const cachedOtp = await this.cacheManager.get(`admin_otp_${admin.id}`);

    if (cachedOtp !== otp) {
      await this.cacheManager.set(attemptKey, attempts + 1, 15 * 60 * 1000);
      throw new BadRequestException(`Invalid OTP. ${2 - attempts} attempts remaining.`);
    }

    await this.cacheManager.del(`admin_otp_${admin.id}`);
    await this.cacheManager.del(attemptKey);
    const tokens = await this.generateTokens(admin.id);

    return { ...tokens, user: admin };
  }

  async sendUserOtp(loginId: string) {
    const user = await this.findUserByLoginId(loginId);
    const otp = this.generateOtp();

    await this.cacheManager.set(`user_otp_${user.id}`, otp, 10 * 60 * 1000);
    await this.cacheManager.del(`user_otp_attempts_${user.id}`);
    
    await this.emailService.sendOTP(user.email, otp, OtpType.USER);

    return { message: 'OTP sent successfully' };
  }

  async userLogin(loginId: string, otp: string, role: UserRole) {
    const user = await this.findUserByLoginId(loginId, role);
    const attemptKey = `user_otp_attempts_${user.id}`;
    const attempts = await this.cacheManager.get<number>(attemptKey) || 0;

    if (attempts >= 3) {
      throw new BadRequestException('Too many OTP attempts. Request new OTP.');
    }

    const cachedOtp = await this.cacheManager.get(`user_otp_${user.id}`);

    if (cachedOtp !== otp) {
      await this.cacheManager.set(attemptKey, attempts + 1, 15 * 60 * 1000);
      throw new BadRequestException(`Invalid OTP. ${2 - attempts} attempts remaining.`);
    }

    await this.cacheManager.del(`user_otp_${user.id}`);
    await this.cacheManager.del(attemptKey);
    const tokens = await this.generateTokens(user.id);

    return { ...tokens, user };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async register(email: string, phoneNumber: string, name: string, password: string, userRole: UserRole = UserRole.USER) {
    const existingUser = await this.repo.findOne({
      where: [{ email }, { phone: phoneNumber }]
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = this.generateOtp();
    await this.cacheManager.set(`register_otp_${email}`, { otp, email, phoneNumber, name, password: hashedPassword, userRole }, 10 * 60 * 1000);
    
    await this.emailService.sendOTP(email, otp, OtpType.REGISTER);

    return { message: 'OTP sent for registration verification' };
  }

  async verifyRegistrationOtp(loginId: string, otp: string) {
    const attemptKey = `register_otp_attempts_${loginId}`;
    const attempts = await this.cacheManager.get<number>(attemptKey) || 0;

    if (attempts >= 3) {
      throw new BadRequestException('Too many OTP attempts. Start registration again.');
    }

    const cachedData = await this.cacheManager.get<any>(`register_otp_${loginId}`);

    if (!cachedData || cachedData.otp !== otp) {
      await this.cacheManager.set(attemptKey, attempts + 1, 15 * 60 * 1000);
      throw new BadRequestException(`Invalid OTP. ${2 - attempts} attempts remaining.`);
    }

    const isServiceProvider = [UserRole.MECANIC, UserRole.VENDOR, UserRole.TOWING_PROVIDER, UserRole.CAR_DETAILER].includes(cachedData.userRole);
    
    const user = this.repo.create({
      email: cachedData.email,
      phone: cachedData.phoneNumber,
      name: cachedData.name,
      password: cachedData.password,
      userRole: cachedData.userRole,
      isVerified: !isServiceProvider
    });

    await this.repo.save(user);
    
    if (isServiceProvider) {
      await this.onboardingService.createOnboardingRecord(user.id, cachedData.userRole);
    }
    
    await this.emailService.sendWelcomeEmail(user.email, user.name, cachedData.userRole);
    
    await this.cacheManager.del(`register_otp_${loginId}`);
    await this.cacheManager.del(attemptKey);

    const tokens = await this.generateTokens(user.id);
    return { ...tokens, user, message: 'Registration completed successfully' };
  }

  async resendOtp(loginId: string, type: OtpType) {
    let cacheKey: string;
    let emailToSend: string;

    if (type === OtpType.REGISTER) {
      const cachedData = await this.cacheManager.get(`register_otp_${loginId}`);
      if (!cachedData) {
        throw new BadRequestException('No active registration session found');
      }
      cacheKey = `register_otp_${loginId}`;
      emailToSend = loginId;
    } else {
      const user = await this.findUserByLoginId(loginId, type === OtpType.ADMIN ? UserRole.ADMIN : undefined);
      cacheKey = `${type}_otp_${user.id}`;
      emailToSend = user.email;
    }

    const otp = this.generateOtp();

    if (type === OtpType.REGISTER) {
      const existingData = await this.cacheManager.get<any>(`register_otp_${loginId}`);
      await this.cacheManager.set(cacheKey, { ...existingData, otp }, 10 * 60 * 1000);
    } else {
      await this.cacheManager.set(cacheKey, otp, 10 * 60 * 1000);
    }

    await this.emailService.sendOTP(emailToSend, otp, type);
    
    return { message: 'OTP resent successfully' };
  }

  async validate(id: string): Promise<Account> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async refreshToken(refreshToken: string) {
    try {
      const session = await this.sessionRepo.findOne({
        where: { refreshToken, isActive: true }
      });

      if (!session || session.refreshExpiresAt < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const payload = this.jwtService.verify(refreshToken);
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Deactivate old session
      session.isActive = false;
      await this.sessionRepo.save(session);

      // Generate new token pair
      const tokens = await this.generateTokens(payload.id);
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    await this.sessionRepo.update(
      { refreshToken },
      { isActive: false }
    );
    return { message: 'Logged out successfully' };
  }

  async findPermission(accountId: string) {
    return this.upRepo.find({
      relations: ['permission', 'menu'],
      where: { accountId, status: true },
    });
  }



  private async generateTokens(userId: string) {
    // Cleanup old sessions for this user
    await this.sessionRepo.update(
      { accountId: userId, isActive: true },
      { isActive: false }
    );

    const accessToken = this.jwtService.sign(
      { id: userId, type: 'access' },
      { expiresIn: '15m' }
    );

    const refreshToken = this.jwtService.sign(
      { id: userId, type: 'refresh' },
      { expiresIn: '7d' }
    );

    // Store session in database
    const session = this.sessionRepo.create({
      token: accessToken,
      refreshToken,
      accountId: userId,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      refreshExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isActive: true
    });

    await this.sessionRepo.save(session);

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60,
      tokenType: 'Bearer'
    };
  }

  private async findUserByLoginId(loginId: string, role?: UserRole): Promise<Account> {
    const query = this.repo.createQueryBuilder('account')
      .select([
        'account.id',
        'account.name',
        'account.email',
        'account.phone',
        'account.userRole',
        'account.status',
        'account.isVerified',
        'account.password'
      ])
      .where('account.email = :loginId OR account.phone = :loginId', { loginId });

    if (role) {
      query.andWhere('account.userRole = :role', { role });
    }

    const user = await query.getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}