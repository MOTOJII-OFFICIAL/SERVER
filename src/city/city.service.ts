import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { City } from './entities/city.entity';
import { CityDto, CityPaginationDto } from './dto/create-city.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly repo: Repository<City>,
  ) {}

  async create(dto: CityDto) {
    const city = this.repo.create(dto);
    return this.repo.save(city);
  }

  async findAll(dto: CityPaginationDto) {
    const query = this.repo
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.state', 'state')
      .leftJoinAndSelect('state.country', 'country')
      .select([
        'city.id',
        'city.name',
        'city.code',
        'city.status',
        'city.createdAt',
        'city.updatedAt',
        'state.id',
        'state.name',
        'country.id',
        'country.name'
      ]);

    if (dto.keyword) {
      query.andWhere(new Brackets(qb => {
        qb.where('city.name ILIKE :keyword', { keyword: `%${dto.keyword}%` })
          .orWhere('city.code ILIKE :keyword', { keyword: `%${dto.keyword}%` });
      }));
    }

    if (dto.stateId) {
      query.andWhere('city.stateId = :stateId', { stateId: dto.stateId });
    }

    if (dto.countryId) {
      query.andWhere('state.countryId = :countryId', { countryId: dto.countryId });
    }

    if (dto.status) {
      query.andWhere('city.status = :status', { status: dto.status });
    }

    const [result, count] = await query
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();

    return { result, count };
  }

  async findOne(id: string) {
    const city = await this.repo.findOne({
      where: { id },
      relations: ['state', 'state.country'],
    });
    if (!city) {
      throw new NotFoundException('City not found');
    }
    return city;
  }

  async update(id: string, dto: CityDto) {
    const city = await this.findOne(id);
    Object.assign(city, dto);
    return this.repo.save(city);
  }

  async remove(id: string) {
    const city = await this.findOne(id);
    city.status = DefaultStatus.DELETED;
    return this.repo.save(city);
  }
}