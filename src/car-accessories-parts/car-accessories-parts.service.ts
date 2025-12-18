import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { CarAccessoriesParts } from './entities/car-accessories-parts.entity';
import { CreateCarAccessoriesPartsDto } from './dto/create-car-accessories-parts.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Account } from 'src/account/entities/account.entity';
import { UserRole, DefaultStatus } from 'src/enum';
import { join } from 'path';
import { unlink } from 'fs/promises';

@Injectable()
export class CarAccessoriesPartsService {
  constructor(
    @InjectRepository(CarAccessoriesParts)
    private partsRepository: Repository<CarAccessoriesParts>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async create(vendorId: string, createDto: CreateCarAccessoriesPartsDto): Promise<CarAccessoriesParts> {
    const vendor = await this.accountRepository.findOne({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    if (vendor.userRole !== UserRole.VENDOR) {
      throw new BadRequestException('Only vendors can create parts');
    }

    const part = this.partsRepository.create({
      ...createDto,
      vendorId,
      createdBy: vendorId,
    });

    return this.partsRepository.save(part);
  }

  async findAll(paginationDto: PaginationDto, categoryId?: string) {
    const query = this.partsRepository
      .createQueryBuilder('part')
      .leftJoin('part.category', 'category')
      .leftJoin('part.vendor', 'vendor')
      .select([
        'part.id',
        'part.name',
        'part.description',
        'part.price',
        'part.stockQuantity',
        'part.status',
        'part.imagePath',
        'part.imageUrl',
        'category.id',
        'category.name',
        'vendor.id',
        'vendor.name'
      ])
      .where('part.stockQuantity > 0')
      .andWhere('part.status = :status', { status: DefaultStatus.ACTIVE });

    if (categoryId) {
      query.andWhere('part.categoryId = :categoryId', { categoryId });
    }

    if (paginationDto.keyword) {
      query.andWhere(new Brackets(qb => {
        qb.where('part.name ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` })
          .orWhere('part.description ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` });
      }));
    }

    const [result, count] = await query
      .skip(paginationDto.offset)
      .take(paginationDto.limit)
      .getManyAndCount();

    return { result, count };
  }

  async findVendorParts(vendorId: string, paginationDto?: PaginationDto) {
    if (!paginationDto) {
      return this.partsRepository.find({
        where: { vendorId },
        relations: ['category'],
        order: { createdAt: 'DESC' },
      });
    }

    const query = this.partsRepository
      .createQueryBuilder('part')
      .leftJoin('part.category', 'category')
      .select([
        'part.id',
        'part.name',
        'part.description',
        'part.price',
        'part.stockQuantity',
        'part.status',
        'part.imagePath',
        'part.imageUrl',
        'part.createdAt',
        'category.id',
        'category.name'
      ])
      .where('part.vendorId = :vendorId', { vendorId })
      .orderBy('part.createdAt', 'DESC');

    if (paginationDto.keyword) {
      query.andWhere(new Brackets(qb => {
        qb.where('part.name ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` })
          .orWhere('part.description ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` });
      }));
    }

    const [result, count] = await query
      .skip(paginationDto.offset)
      .take(paginationDto.limit)
      .getManyAndCount();

    return { result, count };
  }

  async findByVendor(vendorId: string) {
    return this.partsRepository.find({
      where: { vendorId },
      relations: ['category'],
    });
  }

  async updateStock(id: string, vendorId: string, stockQuantity: number) {
    const part = await this.partsRepository.findOne({ where: { id, vendorId } });
    if (!part) {
      throw new NotFoundException('Part not found');
    }

    part.stockQuantity = stockQuantity;
    part.updatedBy = vendorId;
    return this.partsRepository.save(part);
  }

  async uploadImage(imagePath: string, part: CarAccessoriesParts) {
    if (part.imagePath) {
      const oldPath = join(__dirname, '..', '..', part.imagePath);
      try {
        await unlink(oldPath);
      } catch (err) {
        console.warn(`Failed to delete old image: ${oldPath}`, err.message);
      }
    }
    part.imagePath = imagePath;
    part.imageUrl = process.env.MJ_CDN_LINK + imagePath;
    return this.partsRepository.save(part);
  }

  async findPendingParts() {
    return this.partsRepository.find({
      where: { status: DefaultStatus.PENDING },
      relations: ['category', 'vendor'],
      order: { createdAt: 'DESC' },
    });
  }

  async approvePart(id: string, adminId: string) {
    const part = await this.partsRepository.findOne({ where: { id } });
    if (!part) {
      throw new NotFoundException('Part not found');
    }

    part.status = DefaultStatus.ACTIVE;
    part.updatedBy = adminId;
    return this.partsRepository.save(part);
  }

  async rejectPart(id: string, adminId: string) {
    const part = await this.partsRepository.findOne({ where: { id } });
    if (!part) {
      throw new NotFoundException('Part not found');
    }

    part.status = DefaultStatus.DELETED;
    part.updatedBy = adminId;
    return this.partsRepository.save(part);
  }
}