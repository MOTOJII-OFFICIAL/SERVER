import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAdditionalDetail } from './entities/user-additional-detail.entity';
import { UserRole, WorkingStatus } from 'src/enum';
import { CreateUserAdditionalDetailDto } from './dto/create-user-additional-detail.dto';
import { UpdateUserAdditionalDetailDto } from './dto/update-user-additional-detail.dto';

@Injectable()
export class UserAdditionalDetailsService {
  constructor(
    @InjectRepository(UserAdditionalDetail)
    private readonly repo: Repository<UserAdditionalDetail>,
  ) {}

  async create(accountId: string, userRole: UserRole, dto: CreateUserAdditionalDetailDto) {
    const details = this.repo.create({
      ...dto,
      accountId,
      userRole,
      createdBy: accountId
    });
    return this.repo.save(details);
  }

  async findByAccount(accountId: string) {
    const details = await this.repo.findOne({ where: { accountId } });
    if (!details) {
      throw new NotFoundException('User details not found');
    }
    return details;
  }

  async update(accountId: string, dto: UpdateUserAdditionalDetailDto) {
    const details = await this.repo.findOne({ where: { accountId } });
    if (!details) {
      throw new NotFoundException('User details not found');
    }
    Object.assign(details, dto);
    details.updatedBy = accountId;
    return this.repo.save(details);
  }

  async remove(accountId: string) {
    const details = await this.repo.findOne({ where: { accountId } });
    if (!details) {
      throw new NotFoundException('User details not found');
    }
    return this.repo.remove(details);
  }

  async updateWorkingStatus(accountId: string, workingStatus: WorkingStatus) {
    const details = await this.repo.findOne({ where: { accountId } });
    if (!details) {
      throw new NotFoundException('User details not found');
    }
    details.workingStatus = workingStatus;
    details.updatedBy = accountId;
    return this.repo.save(details);
  }

  async uploadDocument(accountId: string, docType: string, imagePath: string) {
    const details = await this.repo.findOne({ where: { accountId } });
    if (!details) {
      throw new NotFoundException('User details not found');
    }

    const urlField = `${docType}Url`;
    const docField = `${docType}Doc`;
    
    details[urlField] = process.env.MJ_CDN_LINK + imagePath;
    details[docField] = imagePath;
    details.updatedBy = accountId;
    
    return this.repo.save(details);
  }
}