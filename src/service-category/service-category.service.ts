import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { ServiceCategory } from './entities/service-category.entity';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { join } from 'path';
import { unlink } from 'fs/promises';

@Injectable()
export class ServiceCategoryService {
  constructor(
    @InjectRepository(ServiceCategory)
    private serviceCategoryRepo: Repository<ServiceCategory>,
  ) {}

  async create(createDto: CreateServiceCategoryDto) {
    const category = this.serviceCategoryRepo.create(createDto);
    return this.serviceCategoryRepo.save(category);
  }

  async findAll(paginationDto: PaginationDto) {
    const query = this.serviceCategoryRepo
      .createQueryBuilder('category')
      .leftJoin('category.services', 'services')
      .select([
        'category.id',
        'category.name',
        'category.description',
        'category.iconPath',
        'category.iconUrl',
        'category.createdAt',
        'services.id'
      ])
      .orderBy('category.createdAt', 'DESC');

    if (paginationDto.keyword) {
      query.andWhere(new Brackets(qb => {
        qb.where('category.name ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` })
          .orWhere('category.description ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` });
      }));
    }

    const [result, count] = await query
      .skip(paginationDto.offset)
      .take(paginationDto.limit)
      .getManyAndCount();

    return { result, count };
  }

  async findOne(id: string) {
    const category = await this.serviceCategoryRepo.findOne({
      where: { id },
      relations: ['services'],
    });

    if (!category) {
      throw new NotFoundException('Service category not found');
    }

    return category;
  }

  async update(id: string, updateDto: UpdateServiceCategoryDto) {
    const category = await this.findOne(id);
    Object.assign(category, updateDto);
    return this.serviceCategoryRepo.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    await this.serviceCategoryRepo.remove(category);
    return { message: 'Service category deleted successfully' };
  }

  async uploadIcon(iconPath: string, category: ServiceCategory) {
    if (category.iconPath) {
      const oldPath = join(__dirname, '..', '..', category.iconPath);
      try {
        await unlink(oldPath);
      } catch (err) {
        console.warn(`Failed to delete old image: ${oldPath}`, err.message);
      }
    }
    category.iconPath = iconPath;
    category.iconUrl = process.env.MJ_CDN_LINK + iconPath;
    return this.serviceCategoryRepo.save(category);
  }
}