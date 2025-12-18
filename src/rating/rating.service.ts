import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { ServiceRequest } from 'src/service-request/entities/service-request.entity';
import { UserAdditionalDetail } from 'src/user-additional-details/entities/user-additional-detail.entity';
import { RequestStatus } from 'src/enum';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(ServiceRequest)
    private serviceRequestRepository: Repository<ServiceRequest>,
    @InjectRepository(UserAdditionalDetail)
    private userAdditionalDetailRepository: Repository<UserAdditionalDetail>,
  ) {}

  async create(userId: string, createDto: CreateRatingDto): Promise<Rating> {
    // Verify service request exists and is completed
    const serviceRequest = await this.serviceRequestRepository.findOne({
      where: { id: createDto.serviceRequestId, userId },
    });

    if (!serviceRequest) {
      throw new BadRequestException('Service request not found');
    }

    if (serviceRequest.requestStatus !== RequestStatus.COMPLETED) {
      throw new BadRequestException('Can only rate completed services');
    }

    // Check if rating already exists
    const existingRating = await this.ratingRepository.findOne({
      where: { serviceRequestId: createDto.serviceRequestId },
    });

    if (existingRating) {
      throw new BadRequestException('Service already rated');
    }

    // Create rating
    const rating = this.ratingRepository.create({
      userId,
      providerId: serviceRequest.providerId,
      serviceRequestId: createDto.serviceRequestId,
      rating: createDto.rating,
      comment: createDto.comment,
    });

    const savedRating = await this.ratingRepository.save(rating);

    // Update provider's average rating
    await this.updateProviderRating(serviceRequest.providerId);

    return savedRating;
  }

  private async updateProviderRating(providerId: string): Promise<void> {
    const result = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'avgRating')
      .where('rating.providerId = :providerId', { providerId })
      .getRawOne();

    const avgRating = parseFloat(result.avgRating) || 0;

    await this.userAdditionalDetailRepository.update(
      { accountId: providerId },
      { rating: Math.round(avgRating * 100) / 100 }, // Round to 2 decimal places
    );
  }

  async findProviderRatings(providerId: string) {
    return this.ratingRepository.find({
      where: { providerId },
      relations: ['user', 'serviceRequest'],
      order: { createdAt: 'DESC' },
    });
  }

  async findUserRatings(userId: string) {
    return this.ratingRepository.find({
      where: { userId },
      relations: ['provider', 'serviceRequest'],
      order: { createdAt: 'DESC' },
    });
  }
}