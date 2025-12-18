import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { ServiceRequest } from './entities/service-request.entity';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Account } from 'src/account/entities/account.entity';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { UserRole, WorkingStatus, RequestStatus, DefaultStatus } from 'src/enum';

@Injectable()
export class ServiceRequestService {
  constructor(
    @InjectRepository(ServiceRequest)
    private serviceRequestRepository: Repository<ServiceRequest>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    private notificationGateway: NotificationGateway,
  ) {}

  async create(userId: string, createDto: CreateServiceRequestDto): Promise<ServiceRequest> {
    // Check if provider is verified and active
    const provider = await this.accountRepository.findOne({ where: { id: createDto.providerId } });
    if (!provider || !provider.isVerified || provider.status !== DefaultStatus.ACTIVE) {
      throw new Error('Provider must be verified and active to receive service requests');
    }

    const entityData: Partial<ServiceRequest> = {
      userId,
      providerId: createDto.providerId,
      vehicleId: createDto.vehicleId,
      serviceId: createDto.serviceId,
      description: createDto.description,
      estimatedPrice: createDto.estimatedPrice,
      scheduledAt: createDto.scheduledAt ? new Date(createDto.scheduledAt) : undefined,
    };
    
    const serviceRequest = this.serviceRequestRepository.create(entityData);
    await this.serviceRequestRepository.save(serviceRequest);
    
    // Send real-time notification to provider
    this.notificationGateway.sendToUser(createDto.providerId, {
      type: 'new_service_request',
      message: 'New service request received',
    });
    
    return serviceRequest;
  }

  async findNearbyProviders(
    lat: number,
    lng: number,
    radius: number = 10,
    userRole?: UserRole,
  ) {
    const query = this.accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.addresses', 'address')
      .leftJoinAndSelect('account.userAdditionalDetails', 'details')
      .where('account.userRole IN (:...roles)', {
        roles: userRole ? [userRole] : [UserRole.MECANIC, UserRole.VENDOR, UserRole.TOWING_PROVIDER, UserRole.CAR_DETAILER],
      })
      .andWhere('account.isVerified = :isVerified', { isVerified: true })
      .andWhere('account.status = :accountStatus', { accountStatus: DefaultStatus.ACTIVE })
      .andWhere('details.workingStatus = :status', { status: WorkingStatus.AVAILABLE })
      .andWhere('address.latitude IS NOT NULL AND address.longitude IS NOT NULL')
      .addSelect(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(address.latitude)) * cos(radians(address.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(address.latitude))))`,
        'distance'
      )
      .having('distance <= :radius')
      .orderBy('details.rating', 'DESC')
      .addOrderBy('distance', 'ASC')
      .setParameters({ lat, lng, radius });

    return query.getRawAndEntities();
  }

  async update(id: string, updateDto: UpdateServiceRequestDto): Promise<ServiceRequest | null> {
    const updateData: Partial<ServiceRequest> = {
      requestStatus: updateDto.requestStatus,
      finalPrice: updateDto.finalPrice,
      completedAt: updateDto.completedAt ? new Date(updateDto.completedAt) : undefined,
    };
    
    await this.serviceRequestRepository.update(id, updateData);
    const updated = await this.serviceRequestRepository.findOne({ 
      where: { id },
      relations: ['user', 'provider']
    });
    
    if (updated) {
      // Send real-time notification to user about status change
      this.notificationGateway.sendToUser(updated.userId, {
        type: 'service_request_updated',
        requestId: updated.id,
        status: updated.requestStatus,
        message: `Service request ${updated.requestStatus.toLowerCase()}`,
        data: updated,
      });
    }
    
    return updated;
  }

  async findUserRequests(userId: string, paginationDto?: PaginationDto) {
    if (!paginationDto) {
      return this.serviceRequestRepository.find({
        where: { userId },
        relations: ['provider', 'vehicle', 'service'],
        order: { createdAt: 'DESC' },
      });
    }

    const query = this.serviceRequestRepository
      .createQueryBuilder('request')
      .leftJoin('request.provider', 'provider')
      .leftJoin('request.vehicle', 'vehicle')
      .leftJoin('request.service', 'service')
      .select([
        'request.id',
        'request.description',
        'request.estimatedPrice',
        'request.finalPrice',
        'request.requestStatus',
        'request.scheduledAt',
        'request.completedAt',
        'request.createdAt',
        'provider.id',
        'provider.name',
        'provider.phone',
        'vehicle.id',
        'vehicle.make',
        'vehicle.model',
        'service.id',
        'service.name'
      ])
      .where('request.userId = :userId', { userId })
      .orderBy('request.createdAt', 'DESC');

    if (paginationDto.keyword) {
      query.andWhere(new Brackets(qb => {
        qb.where('request.description ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` })
          .orWhere('service.name ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` })
          .orWhere('provider.name ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` });
      }));
    }

    const [result, count] = await query
      .skip(paginationDto.offset)
      .take(paginationDto.limit)
      .getManyAndCount();

    return { result, count };
  }

  async findProviderRequests(providerId: string, paginationDto?: PaginationDto) {
    if (!paginationDto) {
      return this.serviceRequestRepository.find({
        where: { providerId },
        relations: ['user', 'vehicle', 'service'],
        order: { createdAt: 'DESC' },
      });
    }

    const query = this.serviceRequestRepository
      .createQueryBuilder('request')
      .leftJoin('request.user', 'user')
      .leftJoin('request.vehicle', 'vehicle')
      .leftJoin('request.service', 'service')
      .select([
        'request.id',
        'request.description',
        'request.estimatedPrice',
        'request.finalPrice',
        'request.requestStatus',
        'request.scheduledAt',
        'request.completedAt',
        'request.createdAt',
        'user.id',
        'user.name',
        'user.phone',
        'vehicle.id',
        'vehicle.make',
        'vehicle.model',
        'service.id',
        'service.name'
      ])
      .where('request.providerId = :providerId', { providerId })
      .orderBy('request.createdAt', 'DESC');

    if (paginationDto.keyword) {
      query.andWhere(new Brackets(qb => {
        qb.where('request.description ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` })
          .orWhere('service.name ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` })
          .orWhere('user.name ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` });
      }));
    }

    const [result, count] = await query
      .skip(paginationDto.offset)
      .take(paginationDto.limit)
      .getManyAndCount();

    return { result, count };
  }

  async acceptRequest(providerId: string, requestId: string): Promise<ServiceRequest | null> {
    // Check if provider is verified and active
    const provider = await this.accountRepository.findOne({ where: { id: providerId } });
    if (!provider || !provider.isVerified || provider.status !== DefaultStatus.ACTIVE) {
      throw new Error('Provider must be verified and active to accept requests');
    }

    const request = await this.serviceRequestRepository.findOne({
      where: { id: requestId, providerId },
      relations: ['user'],
    });
    
    if (!request) return null;
    
    request.requestStatus = RequestStatus.ACCEPTED;
    const updated = await this.serviceRequestRepository.save(request);
    
    this.notificationGateway.sendToUser(request.userId, {
      type: 'service_request_accepted',
      message: 'Your service request has been accepted',
    });
    
    return updated;
  }

  async rejectRequest(providerId: string, requestId: string): Promise<ServiceRequest | null> {
    // Check if provider is verified and active
    const provider = await this.accountRepository.findOne({ where: { id: providerId } });
    if (!provider || !provider.isVerified || provider.status !== DefaultStatus.ACTIVE) {
      throw new Error('Provider must be verified and active to reject requests');
    }

    const request = await this.serviceRequestRepository.findOne({
      where: { id: requestId, providerId },
      relations: ['user'],
    });
    
    if (!request) return null;
    
    request.requestStatus = RequestStatus.CANCELLED;
    const updated = await this.serviceRequestRepository.save(request);
    
    this.notificationGateway.sendToUser(request.userId, {
      type: 'service_request_rejected',
      message: 'Your service request has been rejected',
    });
    
    return updated;
  }

  async getProviderStats(providerId: string) {
    const totalRequests = await this.serviceRequestRepository.count({ where: { providerId } });
    const completedRequests = await this.serviceRequestRepository.count({ 
      where: { providerId, requestStatus: RequestStatus.COMPLETED } 
    });
    
    const earningsResult = await this.serviceRequestRepository
      .createQueryBuilder('sr')
      .select('SUM(sr.finalPrice)', 'totalEarnings')
      .where('sr.providerId = :providerId', { providerId })
      .andWhere('sr.requestStatus = :status', { status: RequestStatus.COMPLETED })
      .getRawOne();
    
    return {
      totalRequests,
      completedRequests,
      totalEarnings: parseFloat(earningsResult.totalEarnings) || 0,
      completionRate: totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0,
    };
  }
}