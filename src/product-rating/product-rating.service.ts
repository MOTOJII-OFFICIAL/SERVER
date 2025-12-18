import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRating } from './entities/product-rating.entity';
import { CreateProductRatingDto } from './dto/create-product-rating.dto';
import { CarAccessoriesParts } from 'src/car-accessories-parts/entities/car-accessories-parts.entity';

@Injectable()
export class ProductRatingService {
  constructor(
    @InjectRepository(ProductRating)
    private ratingRepository: Repository<ProductRating>,
    @InjectRepository(CarAccessoriesParts)
    private partsRepository: Repository<CarAccessoriesParts>,
  ) {}

  async create(userId: string, createDto: CreateProductRatingDto): Promise<ProductRating> {
    const existingRating = await this.ratingRepository.findOne({
      where: { userId, productId: createDto.productId },
    });

    if (existingRating) {
      throw new BadRequestException('Product already rated');
    }

    const rating = this.ratingRepository.create({
      ...createDto,
      userId,
      createdBy: userId,
    });

    return this.ratingRepository.save(rating);
  }

  async findProductRatings(productId: string) {
    return this.ratingRepository.find({
      where: { productId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getProductRatingStats(productId: string) {
    const ratings = await this.ratingRepository.find({ where: { productId } });
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
      : 0;

    return {
      totalRatings,
      averageRating: Math.round(averageRating * 100) / 100,
      ratingDistribution: {
        5: ratings.filter(r => r.rating === 5).length,
        4: ratings.filter(r => r.rating === 4).length,
        3: ratings.filter(r => r.rating === 3).length,
        2: ratings.filter(r => r.rating === 2).length,
        1: ratings.filter(r => r.rating === 1).length,
      }
    };
  }
}