import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Address } from './entities/address.entity';
import { AddressDto, AddressPaginationDto } from './dto/create-address.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly repo: Repository<Address>,
  ) {}

  async create(accountId: string, dto: AddressDto) {
    const address = this.repo.create({ ...dto, accountId });
    return this.repo.save(address);
  }

  async findAll(dto: AddressPaginationDto) {
    const query = this.repo
      .createQueryBuilder('address')
      .leftJoin('address.account', 'account')
      .leftJoin('address.country', 'country')
      .leftJoin('address.state', 'state')
      .leftJoin('address.city', 'city')
      .select([
        'address.id',
        'address.streetName',
        'address.houseNo',
        'address.pinCode',
        'address.landmark',
        'address.latitude',
        'address.longitude',
        'address.accountId',
        'address.countryId',
        'address.stateId',
        'address.cityId',
        'address.addressType',
        'address.status',
        'address.createdAt',
        'address.updatedAt',
        'account.id',
        'account.name',
        'country.id',
        'country.name',
        'state.id',
        'state.name',
        'city.id',
        'city.name'
      ]);

    if (dto.keyword) {
      query.andWhere(new Brackets(qb => {
        qb.where('address.streetName ILIKE :keyword', { keyword: `%${dto.keyword}%` })
          .orWhere('address.houseNo ILIKE :keyword', { keyword: `%${dto.keyword}%` })
          .orWhere('address.landmark ILIKE :keyword', { keyword: `%${dto.keyword}%` })
          .orWhere('address.pinCode ILIKE :keyword', { keyword: `%${dto.keyword}%` })
          .orWhere('account.name ILIKE :keyword', { keyword: `%${dto.keyword}%` })
          .orWhere('country.name ILIKE :keyword', { keyword: `%${dto.keyword}%` })
          .orWhere('state.name ILIKE :keyword', { keyword: `%${dto.keyword}%` })
          .orWhere('city.name ILIKE :keyword', { keyword: `%${dto.keyword}%` });
      }));
    }

    if (dto.accountId) {
      query.andWhere('address.accountId = :accountId', { accountId: dto.accountId });
    }

    if (dto.countryId) {
      query.andWhere('address.countryId = :countryId', { countryId: dto.countryId });
    }

    if (dto.stateId) {
      query.andWhere('address.stateId = :stateId', { stateId: dto.stateId });
    }

    if (dto.cityId) {
      query.andWhere('address.cityId = :cityId', { cityId: dto.cityId });
    }

    if (dto.status) {
      query.andWhere('address.status = :status', { status: dto.status });
    }

    const [result, count] = await query
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();

    return { result, count };
  }

  async findByAccount(accountId: string, dto: AddressPaginationDto) {
    dto.accountId = accountId;
    dto.status = DefaultStatus.ACTIVE;
    return this.findAll(dto);
  }

  async findOne(id: string) {
    const address = await this.repo
      .createQueryBuilder('address')
      .leftJoin('address.account', 'account')
      .leftJoin('address.country', 'country')
      .leftJoin('address.state', 'state')
      .leftJoin('address.city', 'city')
      .select([
        'address.id',
        'address.streetName',
        'address.houseNo',
        'address.pinCode',
        'address.landmark',
        'address.latitude',
        'address.longitude',
        'address.accountId',
        'address.countryId',
        'address.stateId',
        'address.cityId',
        'address.addressType',
        'address.status',
        'address.createdAt',
        'address.updatedAt',
        'account.id',
        'account.name',
        'country.id',
        'country.name',
        'state.id',
        'state.name',
        'city.id',
        'city.name'
      ])
      .where('address.id = :id', { id })
      .getOne();
      
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  async update(id: string, accountId: string, dto: AddressDto) {
    const address = await this.repo.findOne({ where: { id, accountId } });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    Object.assign(address, dto);
    return this.repo.save(address);
  }

  async remove(id: string, accountId: string) {
    const address = await this.repo.findOne({ where: { id, accountId } });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    address.status = DefaultStatus.DELETED;
    return this.repo.save(address);
  }
}