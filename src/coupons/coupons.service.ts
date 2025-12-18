import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { CouponUsage } from './entities/coupon-usage.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { CouponType } from 'src/enum';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    @InjectRepository(CouponUsage)
    private couponUsageRepository: Repository<CouponUsage>,
  ) {}

  async create(createDto: CreateCouponDto): Promise<Coupon> {
    const existingCoupon = await this.couponRepository.findOne({
      where: { code: createDto.code.toUpperCase() },
    });

    if (existingCoupon) {
      throw new BadRequestException('Coupon code already exists');
    }

    const coupon = this.couponRepository.create({
      ...createDto,
      code: createDto.code.toUpperCase(),
      validFrom: new Date(createDto.validFrom),
      validUntil: new Date(createDto.validUntil),
    });

    return this.couponRepository.save(coupon);
  }

  async findAll() {
    return this.couponRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findActive() {
    const now = new Date();
    return this.couponRepository.find({
      where: {
        isActive: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async applyCoupon(userId: string, applyDto: ApplyCouponDto) {
    const coupon = await this.couponRepository.findOne({
      where: { code: applyDto.couponCode.toUpperCase() },
    });

    if (!coupon) {
      throw new NotFoundException('Invalid coupon code');
    }

    // Validate coupon
    const now = new Date();
    if (!coupon.isActive) {
      throw new BadRequestException('Coupon is not active');
    }

    if (now < coupon.validFrom || now > coupon.validUntil) {
      throw new BadRequestException('Coupon has expired or not yet valid');
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit exceeded');
    }

    if (coupon.minimumOrderAmount && applyDto.orderAmount < coupon.minimumOrderAmount) {
      throw new BadRequestException(`Minimum order amount is ${coupon.minimumOrderAmount}`);
    }

    // Check user usage limit
    const userUsageCount = await this.couponUsageRepository.count({
      where: { couponId: coupon.id, userId },
    });

    if (userUsageCount >= coupon.usageLimitPerUser) {
      throw new BadRequestException('You have already used this coupon maximum times');
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === CouponType.PERCENTAGE) {
      discountAmount = (applyDto.orderAmount * coupon.value) / 100;
      if (coupon.maximumDiscountAmount && discountAmount > coupon.maximumDiscountAmount) {
        discountAmount = coupon.maximumDiscountAmount;
      }
    } else if (coupon.type === CouponType.FIXED_AMOUNT) {
      discountAmount = Math.min(coupon.value, applyDto.orderAmount);
    } else if (coupon.type === CouponType.FREE_DELIVERY) {
      // This would be handled in order calculation
      discountAmount = 0;
    }

    return {
      coupon,
      discountAmount,
      finalAmount: Math.max(0, applyDto.orderAmount - discountAmount),
    };
  }

  async useCoupon(userId: string, couponId: string, orderId: string, orderType: string, discountAmount: number, orderAmount: number) {
    // Record coupon usage
    const usage = this.couponUsageRepository.create({
      couponId,
      userId,
      orderId,
      orderType,
      discountAmount,
      orderAmount,
      createdBy: userId,
    });

    await this.couponUsageRepository.save(usage);

    // Update coupon used count
    await this.couponRepository.increment({ id: couponId }, 'usedCount', 1);

    return usage;
  }

  async uploadIcon(id: string, iconPath: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    coupon.iconPath = iconPath;
    coupon.iconUrl = process.env.MJ_CDN_LINK + iconPath;
    return this.couponRepository.save(coupon);
  }

  async getUserCoupons(userId: string) {
    const now = new Date();
    const availableCoupons = await this.couponRepository
      .createQueryBuilder('coupon')
      .leftJoin('coupon.usages', 'usage', 'usage.userId = :userId', { userId })
      .where('coupon.isActive = :isActive', { isActive: true })
      .andWhere('coupon.validFrom <= :now', { now })
      .andWhere('coupon.validUntil >= :now', { now })
      .andWhere('coupon.usedCount < coupon.usageLimit')
      .groupBy('coupon.id')
      .having('COUNT(usage.id) < coupon.usageLimitPerUser')
      .getMany();

    return availableCoupons;
  }

  async getCouponUsageStats(couponId: string) {
    const coupon = await this.couponRepository.findOne({ where: { id: couponId } });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    const totalUsage = await this.couponUsageRepository.count({ where: { couponId } });
    const totalDiscount = await this.couponUsageRepository
      .createQueryBuilder('usage')
      .select('SUM(usage.discountAmount)', 'total')
      .where('usage.couponId = :couponId', { couponId })
      .getRawOne();

    return {
      coupon,
      totalUsage,
      totalDiscountGiven: parseFloat(totalDiscount.total) || 0,
      remainingUsage: coupon.usageLimit - coupon.usedCount,
    };
  }
}