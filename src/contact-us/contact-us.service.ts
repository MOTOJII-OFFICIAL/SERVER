import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactUs } from './entities/contact-us.entity';
import { CreateContactUsDto } from './dto/create-contact-us.dto';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectRepository(ContactUs)
    private contactRepository: Repository<ContactUs>,
  ) {}

  async create(createDto: CreateContactUsDto, userId?: string): Promise<ContactUs> {
    const contact = this.contactRepository.create({
      ...createDto,
      userId,
      createdBy: userId,
    });

    return this.contactRepository.save(contact);
  }

  async findAll() {
    return this.contactRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async reply(id: string, adminReply: string, adminId: string) {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new Error('Contact message not found');
    }

    contact.adminReply = adminReply;
    contact.repliedAt = new Date();
    contact.updatedBy = adminId;

    return this.contactRepository.save(contact);
  }
}