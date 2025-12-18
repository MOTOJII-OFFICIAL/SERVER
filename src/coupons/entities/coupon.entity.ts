import { Column, Entity, OneToMany } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { CouponUsage } from './coupon-usage.entity';
import { CouponType } from 'src/enum';

@Entity()
export class Coupon extends AppBaseEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: CouponType })
  type: CouponType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number; // Percentage or fixed amount

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minimumOrderAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maximumDiscountAmount: number;

  @Column({ type: 'int', default: 1 })
  usageLimit: number; // Total usage limit

  @Column({ type: 'int', default: 1 })
  usageLimitPerUser: number; // Per user usage limit

  @Column({ type: 'int', default: 0 })
  usedCount: number;

  @Column({ type: 'timestamp' })
  validFrom: Date;

  @Column({ type: 'timestamp' })
  validUntil: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFirstTimeUserOnly: boolean;

  @Column({ nullable: true })
  iconPath: string;

  @Column({ nullable: true })
  iconUrl: string;

  @Column({ nullable: true })
  backgroundColor: string;

  @Column({ nullable: true })
  textColor: string;

  @OneToMany(() => CouponUsage, (usage) => usage.coupon)
  usages: CouponUsage[];
}