import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { State } from './entities/state.entity';
import { StateDto, StatePaginationDto } from './dto/create-state.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(State)
    private readonly repo: Repository<State>,
  ) {}

  async create(dto: StateDto) {
    const state = this.repo.create(dto);
    return this.repo.save(state);
  }

  async findAll(dto: StatePaginationDto) {
    const query = this.repo
      .createQueryBuilder('state')
      .leftJoinAndSelect('state.country', 'country')
      .select([
        'state.id',
        'state.name',
        'state.code',
        'state.status',
        'state.createdAt',
        'state.updatedAt',
        'country.id',
        'country.name'
      ]);

    if (dto.keyword) {
      query.andWhere(new Brackets(qb => {
        qb.where('state.name ILIKE :keyword', { keyword: `%${dto.keyword}%` })
          .orWhere('state.code ILIKE :keyword', { keyword: `%${dto.keyword}%` });
      }));
    }

    if (dto.countryId) {
      query.andWhere('state.countryId = :countryId', { countryId: dto.countryId });
    }

    if (dto.status) {
      query.andWhere('state.status = :status', { status: dto.status });
    }

    const [result, count] = await query
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();

    return { result, count };
  }

  async findOne(id: string) {
    const state = await this.repo.findOne({
      where: { id },
      relations: ['country', 'cities'],
    });
    if (!state) {
      throw new NotFoundException('State not found');
    }
    return state;
  }

  async update(id: string, dto: StateDto) {
    const state = await this.findOne(id);
    Object.assign(state, dto);
    return this.repo.save(state);
  }

  async remove(id: string) {
    const state = await this.findOne(id);
    state.status = DefaultStatus.DELETED;
    return this.repo.save(state);
  }
}