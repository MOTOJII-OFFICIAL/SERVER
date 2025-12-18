import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarAccessoriesPartsCategoryService } from './car-accessories-parts-category.service';
import { CarAccessoriesPartsCategoryController } from './car-accessories-parts-category.controller';
import { CarAccessoriesPartsCategory } from './entities/car-accessories-parts-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarAccessoriesPartsCategory])],
  controllers: [CarAccessoriesPartsCategoryController],
  providers: [CarAccessoriesPartsCategoryService],
  exports: [CarAccessoriesPartsCategoryService],
})
export class CarAccessoriesPartsCategoryModule {}