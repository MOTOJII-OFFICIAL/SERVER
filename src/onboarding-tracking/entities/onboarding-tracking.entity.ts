import { Column, Entity, ManyToOne } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { Account } from 'src/account/entities/account.entity';
import { OnboardingStatus, UserRole } from 'src/enum';

@Entity()
export class OnboardingTracking extends AppBaseEntity {
  @Column({ type: 'uuid' })
  accountId: string;

  @Column({ type: 'enum', enum: UserRole })
  userRole: UserRole;

  @Column({ type: 'enum', enum: OnboardingStatus, default: OnboardingStatus.DOCUMENT_PENDING })
  onboardingStatus: OnboardingStatus;

  @Column({ type: 'text', nullable: true })
  adminRemark: string;

  @Column({ type: 'uuid', nullable: true })
  reviewedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  canRetryAfter: Date;

  @ManyToOne(() => Account, (account) => account.onboardingTracking, { onDelete: 'CASCADE' })
  account: Account;
}