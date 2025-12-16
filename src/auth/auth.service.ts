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
import { UserRole, OtpType } from 'src/enum';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Account) private readonly repo: Repository<Account>,
    @InjectRepository(UserPermission) private readonly upRepo: Repository<UserPermission>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async sendAdminOtp(loginId: string) {
    const admin = await this.findUserByLoginId(loginId, UserRole.ADMIN);
    const otp = this.generateOtp();
    
    await this.cacheManager.set(`admin_otp_${admin.id}`, otp, 15 * 60 * 1000);
    console.log(`Admin OTP for ${loginId}: ${otp}`);
    
    return { message: 'OTP sent successfully' };
  }

  async adminLogin(loginId: string, otp: string) {
    const admin = await this.findUserByLoginId(loginId, UserRole.ADMIN);
    const cachedOtp = await this.cacheManager.get(`admin_otp_${admin.id}`);
    
    if (cachedOtp !== otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    
    await this.cacheManager.del(`admin_otp_${admin.id}`);
    const tokens = await this.generateTokens(admin.id);
    
    return { ...tokens, user: admin };
  }

  async sendUserOtp(loginId: string) {
    const user = await this.findUserByLoginId(loginId);
    const otp = this.generateOtp();
    
    await this.cacheManager.set(`user_otp_${user.id}`, otp, 15 * 60 * 1000);
    console.log(`User OTP for ${loginId}: ${otp}`);
    
    return { message: 'OTP sent successfully' };
  }

  async userLogin(loginId: string, otp: string, role: UserRole) {
    const user = await this.findUserByLoginId(loginId, role);
    const cachedOtp = await this.cacheManager.get(`user_otp_${user.id}`);
    
    if (cachedOtp !== otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    
    await this.cacheManager.del(`user_otp_${user.id}`);
    const tokens = await this.generateTokens(user.id);
    
    return { ...tokens, user };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async register(email: string, phoneNumber: string, name: string, password: string) {
    const existingUser = await this.repo.findOne({
      where: [{ email }, { phone: phoneNumber }]
    });
    
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    
    const otp = this.generateOtp();
    await this.cacheManager.set(`register_otp_${email}`, { otp, email, phoneNumber, name, password }, 15 * 60 * 1000);
    console.log(`Registration OTP for ${email}: ${otp}`);
    
    return { message: 'OTP sent for registration verification' };
  }

  async verifyRegistrationOtp(loginId: string, otp: string) {
    const cachedData = await this.cacheManager.get<any>(`register_otp_${loginId}`);
    
    if (!cachedData || cachedData.otp !== otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    
    const user = this.repo.create({
      email: cachedData.email,
      phone: cachedData.phoneNumber,
      name: cachedData.name,
      password: cachedData.password,
      userRole: UserRole.USER
    });
    
    await this.repo.save(user);
    await this.cacheManager.del(`register_otp_${loginId}`);
    
    const tokens = await this.generateTokens(user.id);
    return { ...tokens, user, message: 'Registration completed successfully' };
  }

  async resendOtp(loginId: string, type: OtpType) {
    let cacheKey: string;
    let user: Account;
    
    if (type === OtpType.REGISTER) {
      const cachedData = await this.cacheManager.get(`register_otp_${loginId}`);
      if (!cachedData) {
        throw new BadRequestException('No active registration session found');
      }
      cacheKey = `register_otp_${loginId}`;
    } else {
      user = await this.findUserByLoginId(loginId, type === OtpType.ADMIN ? UserRole.ADMIN : undefined);
      cacheKey = `${type}_otp_${user.id}`;
    }
    
    const otp = this.generateOtp();
    
    if (type === OtpType.REGISTER) {
      const existingData = await this.cacheManager.get<any>(`register_otp_${loginId}`);
      await this.cacheManager.set(cacheKey, { ...existingData, otp }, 15 * 60 * 1000);
    } else {
      await this.cacheManager.set(cacheKey, otp, 15 * 60 * 1000);
    }
    
    console.log(`Resend OTP for ${loginId}: ${otp}`);
    return { message: 'OTP resent successfully' };
  }

  async validate(id: string): Promise<Account> {
    return this.findUserByLoginId(id);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }
      
      const tokens = await this.generateTokens(payload.id);
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    await this.cacheManager.set(`blacklist_${refreshToken}`, true, 7 * 24 * 60 * 60 * 1000);
    return { message: 'Logged out successfully' };
  }

  async findPermission(accountId: string) {
    return this.upRepo.find({
      relations: ['permission', 'menu'],
      where: { accountId, status: true },
    });
  }

  private async generateTokens(userId: string) {
    const accessToken = this.jwtService.sign(
      { id: userId, type: 'access' },
      { expiresIn: '15m' }
    );
    
    const refreshToken = this.jwtService.sign(
      { id: userId, type: 'refresh' },
      { expiresIn: '7d' }
    );
    
    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60,
      tokenType: 'Bearer'
    };
  }

  private async findUserByLoginId(loginId: string, role?: UserRole): Promise<Account> {
    const query = this.repo.createQueryBuilder('account')
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