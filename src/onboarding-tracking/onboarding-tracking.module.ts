import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnboardingTrackingService } from './onboarding-tracking.service';
import { OnboardingTrackingController } from './onboarding-tracking.controller';
import { OnboardingTracking } from './entities/onboarding-tracking.entity';
import { Account } from 'src/account/entities/account.entity';
import { UserAdditionalDetail } from 'src/user-additional-details/entities/user-additional-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OnboardingTracking, Account, UserAdditionalDetail])
  ],
  controllers: [OnboardingTrackingController],
  providers: [OnboardingTrackingService],
  exports: [OnboardingTrackingService],
})
export class OnboardingTrackingModule {}