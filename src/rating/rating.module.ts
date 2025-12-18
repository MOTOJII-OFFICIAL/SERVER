import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { Rating } from './entities/rating.entity';
import { ServiceRequest } from 'src/service-request/entities/service-request.entity';
import { UserAdditionalDetail } from 'src/user-additional-details/entities/user-additional-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, ServiceRequest, UserAdditionalDetail])],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService],
})
export class RatingModule {}