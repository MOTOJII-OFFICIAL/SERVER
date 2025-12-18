import { Column, Entity, ManyToOne } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { Coupon } from './coupon.entity';
import { Account } from 'src/account/entities/account.entity';

@Entity()
export class CouponUsage extends AppBaseEntity {
  @Column({ type: 'uuid' })
  couponId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid', nullable: true })
  orderId: string; // Can be service request or parts order

  @Column({ type: 'varchar', nullable: true })
  orderType: string; // 'service' or 'parts'

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  orderAmount: number;

  @ManyToOne(() => Coupon, (coupon) => coupon.usages, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  coupon: Coupon;

  @ManyToOne(() => Account, (account) => account.couponUsages, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: Account;
}