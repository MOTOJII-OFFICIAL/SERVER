import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { VehicleCategory } from 'src/enum';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepo: Repository<Vehicle>,
  ) {}

  async create(accountId: string, createDto: CreateVehicleDto) {
    // Validate car type for cars
    if (createDto.category === VehicleCategory.CAR && !createDto.carType) {
      throw new BadRequestException('Car type is required for cars');
    }

    // If this is set as default, unset other defaults
    if (createDto.isDefault) {
      await this.vehicleRepo.update(
        { accountId, isDefault: true },
        { isDefault: false }
      );
    }

    const vehicle = this.vehicleRepo.create({
      ...createDto,
      accountId,
    });

    return this.vehicleRepo.save(vehicle);
  }

  async findUserVehicles(accountId: string, paginationDto?: PaginationDto) {
    if (!paginationDto) {
      return this.vehicleRepo.find({
        where: { accountId },
        order: { isDefault: 'DESC', createdAt: 'DESC' },
      });
    }

    const query = this.vehicleRepo
      .createQueryBuilder('vehicle')
      .select([
        'vehicle.id',
        'vehicle.make',
        'vehicle.model',
        'vehicle.year',
        'vehicle.color',
        'vehicle.licensePlate',
        'vehicle.category',
        'vehicle.carType',
        'vehicle.isDefault',
        'vehicle.createdAt'
      ])
      .where('vehicle.accountId = :accountId', { accountId })
      .orderBy('vehicle.isDefault', 'DESC')
      .addOrderBy('vehicle.createdAt', 'DESC');

    if (paginationDto.keyword) {
      query.andWhere(new Brackets(qb => {
        qb.where('vehicle.make ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` })
          .orWhere('vehicle.model ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` })
          .orWhere('vehicle.licensePlate ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` });
      }));
    }

    const [result, count] = await query
      .skip(paginationDto.offset)
      .take(paginationDto.limit)
      .getManyAndCount();

    return { result, count };
  }

  async findOne(id: string, accountId: string) {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id, accountId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async update(id: string, accountId: string, updateDto: UpdateVehicleDto) {
    const vehicle = await this.findOne(id, accountId);

    // If setting as default, unset other defaults
    if (updateDto.isDefault) {
      await this.vehicleRepo.update(
        { accountId, isDefault: true },
        { isDefault: false }
      );
    }

    Object.assign(vehicle, updateDto);
    return this.vehicleRepo.save(vehicle);
  }

  async remove(id: string, accountId: string) {
    const vehicle = await this.findOne(id, accountId);
    await this.vehicleRepo.remove(vehicle);
    return { message: 'Vehicle deleted successfully' };
  }

  async setDefault(id: string, accountId: string) {
    const vehicle = await this.findOne(id, accountId);

    // Unset other defaults
    await this.vehicleRepo.update(
      { accountId, isDefault: true },
      { isDefault: false }
    );

    // Set this as default
    vehicle.isDefault = true;
    await this.vehicleRepo.save(vehicle);

    return { message: 'Default vehicle updated' };
  }
}