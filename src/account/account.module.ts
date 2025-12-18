import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Account } from './entities/account.entity';
import { Address } from 'src/address/entities/address.entity';
import { ServiceRequest } from 'src/service-request/entities/service-request.entity';
import { UserAdditionalDetail } from 'src/user-additional-details/entities/user-additional-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Address, ServiceRequest, UserAdditionalDetail])],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
