import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceVehicleCategory } from './entities/service-vehicle-category.entity';
import { CreateServiceVehicleCategoryDto } from './dto/create-service-vehicle-category.dto';

@Injectable()
export class ServiceVehicleCategoryService {
  constructor(
    @InjectRepository(ServiceVehicleCategory)
    private serviceVehicleCategoryRepo: Repository<ServiceVehicleCategory>,
  ) {}

  async create(createDto: CreateServiceVehicleCategoryDto) {
    const relation = this.serviceVehicleCategoryRepo.create(createDto);
    return this.serviceVehicleCategoryRepo.save(relation);
  }

  async findByService(serviceId: string) {
    return this.serviceVehicleCategoryRepo.find({
      where: { serviceId },
      relations: ['vehicleCategory'],
    });
  }

  async findByVehicleCategory(vehicleCategoryId: string) {
    return this.serviceVehicleCategoryRepo.find({
      where: { vehicleCategoryId },
      relations: ['service'],
    });
  }

  async remove(serviceId: string, vehicleCategoryId: string) {
    const relation = await this.serviceVehicleCategoryRepo.findOne({
      where: { serviceId, vehicleCategoryId },
    });

    if (!relation) {
      throw new NotFoundException('Service-VehicleCategory relation not found');
    }

    await this.serviceVehicleCategoryRepo.remove(relation);
    return { message: 'Relation removed successfully' };
  }

  async removeByService(serviceId: string) {
    await this.serviceVehicleCategoryRepo.delete({ serviceId });
    return { message: 'All relations for service removed' };
  }
}