import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { Service } from './entities/service.entity';
import { ServiceVehicleCategory } from 'src/service-vehicle-category/entities/service-vehicle-category.entity';
import { ServiceCarType } from 'src/service-car-type/entities/service-car-type.entity';
import { Account } from 'src/account/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, ServiceVehicleCategory, ServiceCarType, Account])],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}