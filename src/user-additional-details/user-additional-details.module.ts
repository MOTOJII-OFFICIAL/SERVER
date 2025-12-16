import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAdditionalDetailsService } from './user-additional-details.service';
import { UserAdditionalDetail } from './entities/user-additional-detail.entity';
import { UserAdditionalDetailsController } from './user-additional-details.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserAdditionalDetail])],
  controllers: [UserAdditionalDetailsController],
  providers: [UserAdditionalDetailsService],
  exports: [UserAdditionalDetailsService],
})
export class UserAdditionalDetailsModule {}