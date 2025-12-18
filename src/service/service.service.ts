import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Service } from './entities/service.entity';
import { ServiceVehicleCategory } from 'src/service-vehicle-category/entities/service-vehicle-category.entity';
import { ServiceCarType } from 'src/service-car-type/entities/service-car-type.entity';
import { Account } from 'src/account/entities/account.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginationServiceDto } from './dto/pagination-service.dto';
import { UserRole, DefaultStatus } from 'src/enum';
import { join } from 'path';
import { unlink } from 'fs/promises';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,
    @InjectRepository(ServiceVehicleCategory)
    private serviceVehicleCategoryRepo: Repository<ServiceVehicleCategory>,
    @InjectRepository(ServiceCarType)
    private serviceCarTypeRepo: Repository<ServiceCarType>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async create(createDto: CreateServiceDto) {
    const service = this.serviceRepo.create({
      name: createDto.name,
      description: createDto.description,
      basePrice: createDto.basePrice,
      durationMinutes: createDto.durationMinutes,
      image: createDto.image,
      serviceCategoryId: createDto.serviceCategoryId,
    });

    const savedService = await this.serviceRepo.save(service);

    // Create vehicle category relations
    for (const vehicleCategoryId of createDto.vehicleCategoryIds) {
      await this.serviceVehicleCategoryRepo.save({
        serviceId: savedService.id,
        vehicleCategoryId,
      });
    }

    // Create car type relations
    if (createDto.carTypeIds?.length) {
      for (const carTypeId of createDto.carTypeIds) {
        await this.serviceCarTypeRepo.save({
          serviceId: savedService.id,
          carTypeId,
        });
      }
    }

    return savedService;
  }

  async findAll(paginationDto: PaginationServiceDto, categoryId?: string, providerId?: string) {
    const query = this.serviceRepo
      .createQueryBuilder('service')
      .leftJoin('service.serviceCategory', 'category')
      .leftJoin('service.provider', 'provider')
      .leftJoin('service.serviceVehicleCategories', 'svc')
      .leftJoin('svc.vehicleCategory', 'vehicleCategory')
      .leftJoin('service.serviceCarTypes', 'sct')
      .leftJoin('sct.carType', 'carType')
      .select([
        'service.id',
        'service.name',
        'service.status',
        'service.description',
        'service.basePrice',
        'service.durationMinutes',
        'service.image',
        'service.providerId',
        'category.id',
        'category.name',
        'provider.id',
        'provider.name',
        'svc.id',
        'vehicleCategory.id',
        'vehicleCategory.name',
        'sct.id',
        'carType.id',
        'carType.name'
      ])
      .where('service.status = :status', { status: 'ACTIVE' })
      .andWhere('provider.isVerified = :isVerified', { isVerified: true })
      .andWhere('provider.status = :providerStatus', { providerStatus: DefaultStatus.ACTIVE });

    if (providerId) {
      query.andWhere('service.providerId = :providerId', { providerId });
    }

    if (categoryId) {
      query.andWhere('service.serviceCategoryId = :categoryId', { categoryId });
    }

    if (paginationDto.keyword) {
      query.andWhere(new Brackets(qb => {
        qb.where('service.name ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` })
          .orWhere('service.description ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` })
          .orWhere('provider.name ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` });
      }));
    }

    const [result, count] = await query
      .skip(paginationDto.offset)
      .take(paginationDto.limit)
      .getManyAndCount();

    return { result, count };
  }

  async createProviderService(providerId: string, createDto: CreateServiceDto) {
    const provider = await this.accountRepository.findOne({ where: { id: providerId } });
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    if (!provider.isVerified || provider.status !== DefaultStatus.ACTIVE) {
      throw new BadRequestException('Account must be verified and active to create services');
    }

    const validRoles = [UserRole.MECANIC, UserRole.TOWING_PROVIDER, UserRole.CAR_DETAILER, UserRole.VENDOR];
    if (!validRoles.includes(provider.userRole)) {
      throw new BadRequestException('Invalid provider role for creating services');
    }

    const service = this.serviceRepo.create({
      ...createDto,
      providerId,
      createdBy: providerId,
    });

    const savedService = await this.serviceRepo.save(service);

    // Create vehicle category relations
    for (const vehicleCategoryId of createDto.vehicleCategoryIds) {
      await this.serviceVehicleCategoryRepo.save({
        serviceId: savedService.id,
        vehicleCategoryId,
      });
    }

    // Create car type relations
    if (createDto.carTypeIds?.length) {
      for (const carTypeId of createDto.carTypeIds) {
        await this.serviceCarTypeRepo.save({
          serviceId: savedService.id,
          carTypeId,
        });
      }
    }

    return savedService;
  }

  async findProviderServices(providerId: string) {
    return this.serviceRepo.find({
      where: { providerId },
      relations: ['serviceCategory', 'serviceVehicleCategories', 'serviceCarTypes'],
      order: { createdAt: 'DESC' },
    });
  }

  async findServicesByProvider(providerId: string) {
    return this.serviceRepo.find({
      where: { providerId },
      relations: ['serviceCategory'],
    });
  }

  async findOne(id: string) {
    const service = await this.serviceRepo
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.serviceCategory', 'category')
      .leftJoinAndSelect('service.serviceVehicleCategories', 'svc')
      .leftJoinAndSelect('svc.vehicleCategory', 'vehicleCategory')
      .leftJoinAndSelect('service.serviceCarTypes', 'sct')
      .leftJoinAndSelect('sct.carType', 'carType')
      .where('service.id = :id', { id })
      .getOne();

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async update(id: string, updateDto: UpdateServiceDto) {
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Update vehicle categories if provided
    if (updateDto.vehicleCategoryIds) {
      await this.serviceVehicleCategoryRepo.delete({ serviceId: id });
      for (const vehicleCategoryId of updateDto.vehicleCategoryIds) {
        await this.serviceVehicleCategoryRepo.save({
          serviceId: id,
          vehicleCategoryId,
        });
      }
    }

    // Update car types if provided
    if (updateDto.carTypeIds) {
      await this.serviceCarTypeRepo.delete({ serviceId: id });
      for (const carTypeId of updateDto.carTypeIds) {
        await this.serviceCarTypeRepo.save({
          serviceId: id,
          carTypeId,
        });
      }
    }

    Object.assign(service, updateDto);
    return this.serviceRepo.save(service);
  }

  async remove(id: string) {
    const service = await this.findOne(id);
    await this.serviceRepo.remove(service);
    return { message: 'Service deleted successfully' };
  }

  async uploadIcon(iconPath: string, service: Service) {
    if (service.iconPath) {
      const oldPath = join(__dirname, '..', '..', service.iconPath);
      try {
        await unlink(oldPath);
      } catch (err) {
        console.warn(`Failed to delete old image: ${oldPath}`, err.message);
      }
    }
    service.iconPath = iconPath;
    service.iconUrl = process.env.MJ_CDN_LINK + iconPath;
    return this.serviceRepo.save(service);
  }
}