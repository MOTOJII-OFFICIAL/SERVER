import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Brackets } from 'typeorm';
import { Account } from './entities/account.entity';
import { Address } from 'src/address/entities/address.entity';
import { ServiceRequest } from 'src/service-request/entities/service-request.entity';
import { UserAdditionalDetail } from 'src/user-additional-details/entities/user-additional-detail.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateUserAddressDto } from 'src/address/dto/create-user-address.dto';
import { UserRole, DefaultStatus, WorkingStatus, RequestStatus } from 'src/enum';
import { join } from 'path';
import { unlink } from 'fs/promises';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(ServiceRequest)
    private serviceRequestRepository: Repository<ServiceRequest>,
    @InjectRepository(UserAdditionalDetail)
    private userAdditionalDetailRepository: Repository<UserAdditionalDetail>,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    const account = this.accountRepository.create(createAccountDto);
    return this.accountRepository.save(account);
  }

  async addUserAddress(userId: string, createAddressDto: CreateUserAddressDto) {
    const user = await this.accountRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const address = this.addressRepository.create({
      ...createAddressDto,
      accountId: userId,
      createdBy: userId
    });

    return this.addressRepository.save(address);
  }

  async getUsers(query: GetUsersQueryDto) {
    const { role, search, offset = 0, limit = 10 } = query;
    const queryBuilder = this.accountRepository
      .createQueryBuilder('account')
      .leftJoin('account.addresses', 'addresses')
      .select([
        'account.id',
        'account.name',
        'account.email',
        'account.phone',
        'account.userRole',
        'account.status',
        'account.profileImg',
        'account.profileUrl',
        'account.createdAt',
        'account.updatedAt',
        'addresses.id',
        'addresses.streetName',
        'addresses.houseNo',
        'addresses.pinCode',
        'addresses.addressType'
      ])
      .where('account.status != :deletedStatus', { deletedStatus: DefaultStatus.DELETED });

    if (role) {
      const roles = [UserRole.CAR_DETAILER, UserRole.TOWING_PROVIDER, UserRole.VENDOR, UserRole.MECANIC];
      if (roles.includes(role)) {
        queryBuilder.andWhere('account.userRole = :role', { role });
      }
    }

    if (search) {
      queryBuilder.andWhere(new Brackets(qb => {
        qb.where('account.name ILIKE :search', { search: `%${search}%` })
          .orWhere('account.email ILIKE :search', { search: `%${search}%` })
          .orWhere('account.phone ILIKE :search', { search: `%${search}%` });
      }));
    }

    const [result, count] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { result, count };
  }

  async getProfileById(id: string) {
    const user = await this.accountRepository
      .createQueryBuilder('account')
      .leftJoin('account.addresses', 'addresses')
      .leftJoin('addresses.country', 'country')
      .leftJoin('addresses.state', 'state')
      .leftJoin('addresses.city', 'city')
      .select([
        'account.id',
        'account.name',
        'account.email',
        'account.phone',
        'account.userRole',
        'account.status',
        'account.profileImg',
        'account.profileUrl',
        'account.createdAt',
        'account.updatedAt',
        'addresses.id',
        'addresses.streetName',
        'addresses.houseNo',
        'addresses.pinCode',
        'addresses.landmark',
        'addresses.latitude',
        'addresses.longitude',
        'addresses.addressType',
        'country.id',
        'country.name',
        'state.id',
        'state.name',
        'city.id',
        'city.name'
      ])
      .where('account.id = :id', { id })
      .andWhere('account.status IN (:...statuses)', { 
        statuses: [DefaultStatus.ACTIVE, DefaultStatus.INACTIVE, DefaultStatus.SUSPENDED] 
      })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.accountRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateProfileDto);
    user.updatedBy = userId;
    return this.accountRepository.save(user);
  }

  async updateImage(imagePath: string, user: Account) {
    if (user.profileImg) {
      const oldPath = join(__dirname, '..', '..', user.profileImg);
      try {
        await unlink(oldPath);
      } catch (err) {
        console.warn(`Failed to delete old image: ${oldPath}`, err.message);
      }
    }
    user.profileImg = imagePath;
    user.profileUrl = process.env.MJ_CDN_LINK + imagePath;
    return this.accountRepository.save(user);
  }

  async updateUserStatus(id: string, updateStatusDto: UpdateUserStatusDto, currentUserId: string) {
    const user = await this.accountRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.status = updateStatusDto.status;
    user.updatedBy = currentUserId;
    return this.accountRepository.save(user);
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    Object.assign(account, updateAccountDto);
    return this.accountRepository.save(account);
  }

  async remove(id: string) {
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    account.status = DefaultStatus.DELETED;
    return this.accountRepository.save(account);
  }

  async updateWorkingStatus(accountId: string, workingStatus: WorkingStatus) {
    const details = await this.userAdditionalDetailRepository.findOne({ where: { accountId } });
    if (!details) {
      throw new NotFoundException('User details not found');
    }
    details.workingStatus = workingStatus;
    details.updatedBy = accountId;
    return this.userAdditionalDetailRepository.save(details);
  }

  async getProviderStats(providerId: string) {
    const totalRequests = await this.serviceRequestRepository.count({ where: { providerId } });
    const completedRequests = await this.serviceRequestRepository.count({ 
      where: { providerId, requestStatus: RequestStatus.COMPLETED } 
    });
    
    const earningsResult = await this.serviceRequestRepository
      .createQueryBuilder('sr')
      .select('SUM(sr.finalPrice)', 'totalEarnings')
      .where('sr.providerId = :providerId', { providerId })
      .andWhere('sr.requestStatus = :status', { status: RequestStatus.COMPLETED })
      .getRawOne();
    
    return {
      totalRequests,
      completedRequests,
      totalEarnings: parseFloat(earningsResult.totalEarnings) || 0,
      completionRate: totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0,
    };
  }
}
