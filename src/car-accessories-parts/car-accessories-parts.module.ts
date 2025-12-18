import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarAccessoriesPartsService } from './car-accessories-parts.service';
import { CarAccessoriesPartsController } from './car-accessories-parts.controller';
import { CarAccessoriesParts } from './entities/car-accessories-parts.entity';
import { Account } from 'src/account/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarAccessoriesParts, Account])],
  controllers: [CarAccessoriesPartsController],
  providers: [CarAccessoriesPartsService],
  exports: [CarAccessoriesPartsService],
})
export class CarAccessoriesPartsModule {}