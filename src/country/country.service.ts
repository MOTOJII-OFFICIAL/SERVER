import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Country } from './entities/country.entity';
import { CountryDto, CountryPaginationDto } from './dto/create-country.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly repo: Repository<Country>,
  ) { }

  async create(dto: CountryDto) {
    const country = this.repo.create(dto);
    return this.repo.save(country);
  }

  async findAll(dto: CountryPaginationDto) {
    const query = this.repo
      .createQueryBuilder('country')
      .select(['country.id',
        'country.name',
        'country.code',
        'country.status',
        'country.createdAt',
        'country.updatedAt'
      ]);

    if (dto.keyword) {
      query.andWhere(new Brackets(qb => {
        qb.where('country.name ILIKE :keyword', { keyword: `%${dto.keyword}%` })
          .orWhere('country.code ILIKE :keyword', { keyword: `%${dto.keyword}%` });
      }));
    }

    if (dto.status) {
      query.andWhere('country.status = :status', { status: dto.status });
    }

    const [result, count] = await query
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();

    return { result, count };
  }

  async findOne(id: string) {
    const country = await this.repo.findOne({
      where: { id },
      relations: ['states'],
    });
    if (!country) {
      throw new NotFoundException('Country not found');
    }
    return country;
  }

  async update(id: string, dto: CountryDto) {
    const country = await this.findOne(id);
    Object.assign(country, dto);
    return this.repo.save(country);
  }

  async remove(id: string) {
    const country = await this.findOne(id);
    country.status = DefaultStatus.DELETED;
    return this.repo.save(country);
  }
}