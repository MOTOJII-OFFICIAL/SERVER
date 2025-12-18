import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FAQ } from './entities/faq.entity';
import { CreateFAQDto } from './dto/create-faq.dto';

@Injectable()
export class FAQService {
  constructor(
    @InjectRepository(FAQ)
    private faqRepository: Repository<FAQ>,
  ) {}

  async create(createDto: CreateFAQDto): Promise<FAQ> {
    const faq = this.faqRepository.create(createDto);
    return this.faqRepository.save(faq);
  }

  async findAll(category?: string) {
    const query = this.faqRepository.createQueryBuilder('faq');
    
    if (category) {
      query.where('faq.category = :category', { category });
    }

    return query.orderBy('faq.sortOrder', 'ASC').getMany();
  }

  async findCategories() {
    const result = await this.faqRepository
      .createQueryBuilder('faq')
      .select('DISTINCT faq.category', 'category')
      .where('faq.category IS NOT NULL')
      .getRawMany();

    return result.map(r => r.category);
  }
}