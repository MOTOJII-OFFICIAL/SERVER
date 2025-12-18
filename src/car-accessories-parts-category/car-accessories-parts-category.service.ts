import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarAccessoriesPartsCategory } from './entities/car-accessories-parts-category.entity';
import { CreateCarAccessoriesPartsCategoryDto } from './dto/create-car-accessories-parts-category.dto';

@Injectable()
export class CarAccessoriesPartsCategoryService {
  constructor(
    @InjectRepository(CarAccessoriesPartsCategory)
    private categoryRepository: Repository<CarAccessoriesPartsCategory>,
  ) {}

  async create(createDto: CreateCarAccessoriesPartsCategoryDto): Promise<CarAccessoriesPartsCategory> {
    const category = this.categoryRepository.create(createDto);
    return this.categoryRepository.save(category);
  }

  async findAll() {
    return this.categoryRepository.find({
      relations: ['parts'],
      order: { name: 'ASC' },
    });
  }

  async uploadIcon(id: string, iconPath: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new Error('Category not found');
    }

    category.iconPath = iconPath;
    category.iconUrl = process.env.MJ_CDN_LINK + iconPath;
    return this.categoryRepository.save(category);
  }
}