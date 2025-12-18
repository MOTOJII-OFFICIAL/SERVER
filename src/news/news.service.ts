import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { DefaultStatus } from 'src/enum';
import { join } from 'path';
import { unlink } from 'fs/promises';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async create(createDto: CreateNewsDto): Promise<News> {
    const news = this.newsRepository.create({
      ...createDto,
      publishedAt: createDto.publishedAt ? new Date(createDto.publishedAt) : new Date(),
    });
    return this.newsRepository.save(news);
  }

  async findAll(paginationDto: PaginationDto) {
    const query = this.newsRepository
      .createQueryBuilder('news')
      .select([
        'news.id',
        'news.title',
        'news.content',
        'news.status',
        'news.publishedAt',
        'news.photoPath',
        'news.photoUrl',
        'news.createdAt'
      ])
      .where('news.status = :status', { status: DefaultStatus.ACTIVE })
      .orderBy('news.publishedAt', 'DESC');

    if (paginationDto.keyword) {
      query.andWhere(new Brackets(qb => {
        qb.where('news.title ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` })
          .orWhere('news.content ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` });
      }));
    }

    const [result, count] = await query
      .skip(paginationDto.offset)
      .take(paginationDto.limit)
      .getManyAndCount();

    return { result, count };
  }

  async findOne(id: string) {
    const news = await this.newsRepository.findOne({
      where: { id, status: DefaultStatus.ACTIVE },
    });
    if (!news) {
      throw new NotFoundException('News not found');
    }
    return news;
  }

  async uploadPhoto(photoPath: string, news: News) {
    if (news.photoPath) {
      const oldPath = join(__dirname, '..', '..', news.photoPath);
      try {
        await unlink(oldPath);
      } catch (err) {
        console.warn(`Failed to delete old image: ${oldPath}`, err.message);
      }
    }
    news.photoPath = photoPath;
    news.photoUrl = process.env.MJ_CDN_LINK + photoPath;
    return this.newsRepository.save(news);
  }
}