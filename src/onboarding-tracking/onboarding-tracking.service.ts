import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnboardingTracking } from './entities/onboarding-tracking.entity';
import { Account } from 'src/account/entities/account.entity';
import { UserAdditionalDetail } from 'src/user-additional-details/entities/user-additional-detail.entity';
import { OnboardingStatus, UserRole, DefaultStatus, DocumentType } from 'src/enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { GetUsersByStatusDto } from './dto/get-users-by-status.dto';

@Injectable()
export class OnboardingTrackingService {
  constructor(
    @InjectRepository(OnboardingTracking)
    private onboardingRepo: Repository<OnboardingTracking>,
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    @InjectRepository(UserAdditionalDetail)
    private userDetailsRepo: Repository<UserAdditionalDetail>,
  ) {}

  async createOnboardingRecord(accountId: string, userRole: UserRole) {
    const onboarding = this.onboardingRepo.create({
      accountId,
      userRole,
      onboardingStatus: OnboardingStatus.DOCUMENT_PENDING,
    });
    return this.onboardingRepo.save(onboarding);
  }

  async checkAndUpdateDocumentStatus(accountId: string) {
    const userDetails = await this.userDetailsRepo.findOne({ where: { accountId } });
    const onboarding = await this.onboardingRepo.findOne({ where: { accountId } });

    if (!userDetails || !onboarding) return;

    const requiredDocs = this.getRequiredDocuments(userDetails.userRole);
    const uploadedDocs = this.getUploadedDocuments(userDetails);

    const allDocsUploaded = requiredDocs.every(doc => uploadedDocs.includes(doc));

    if (allDocsUploaded && onboarding.onboardingStatus === OnboardingStatus.DOCUMENT_PENDING) {
      onboarding.onboardingStatus = OnboardingStatus.DOCUMENT_UPLOADED;
      await this.onboardingRepo.save(onboarding);
    }
  }

  async approveUser(accountId: string, adminId: string, remark: string) {
    const onboarding = await this.onboardingRepo.findOne({ where: { accountId } });
    const account = await this.accountRepo.findOne({ where: { id: accountId } });

    if (!onboarding || !account) {
      throw new NotFoundException('User not found');
    }

    onboarding.onboardingStatus = OnboardingStatus.APPROVED;
    onboarding.adminRemark = remark;
    onboarding.reviewedBy = adminId;
    onboarding.reviewedAt = new Date();

    account.isVerified = true;

    await Promise.all([
      this.onboardingRepo.save(onboarding),
      this.accountRepo.save(account)
    ]);
  }

  async rejectUser(accountId: string, adminId: string, remark: string) {
    const onboarding = await this.onboardingRepo.findOne({ where: { accountId } });
    const account = await this.accountRepo.findOne({ where: { id: accountId } });

    if (!onboarding || !account) {
      throw new NotFoundException('User not found');
    }

    const retryDate = new Date();
    retryDate.setDate(retryDate.getDate() + 45);

    onboarding.onboardingStatus = OnboardingStatus.REJECTED;
    onboarding.adminRemark = remark;
    onboarding.reviewedBy = adminId;
    onboarding.reviewedAt = new Date();
    onboarding.rejectedAt = new Date();
    onboarding.canRetryAfter = retryDate;

    account.status = DefaultStatus.SUSPENDED;

    await Promise.all([
      this.onboardingRepo.save(onboarding),
      this.accountRepo.save(account)
    ]);
  }

  async getUsersByStatus(query: GetUsersByStatusDto) {
    const queryBuilder = this.onboardingRepo
      .createQueryBuilder('onboarding')
      .leftJoin('onboarding.account', 'account')
      .leftJoin('account.userAdditionalDetails', 'details')
      .select([
        'onboarding.id',
        'onboarding.accountId',
        'onboarding.userRole',
        'onboarding.onboardingStatus',
        'onboarding.adminRemark',
        'onboarding.reviewedAt',
        'onboarding.canRetryAfter',
        'onboarding.createdAt',
        'account.name',
        'account.email',
        'account.phone',
        'account.isVerified',
        'details.aadharDoc',
        'details.panDoc',
        'details.gstDoc',
        'details.licenceDoc',
        'details.selfieDoc'
      ]);

    if (query.status) {
      queryBuilder.where('onboarding.onboardingStatus = :status', { status: query.status });
    }

    queryBuilder.orderBy('onboarding.createdAt', 'DESC');

    const [result, count] = await queryBuilder
      .skip(query.offset)
      .take(query.limit)
      .getManyAndCount();

    return { result, count };
  }

  async getUserOnboardingDetails(accountId: string) {
    return this.onboardingRepo
      .createQueryBuilder('onboarding')
      .leftJoin('onboarding.account', 'account')
      .leftJoin('account.userAdditionalDetails', 'details')
      .select([
        'onboarding.id',
        'onboarding.accountId',
        'onboarding.userRole',
        'onboarding.onboardingStatus',
        'onboarding.adminRemark',
        'onboarding.reviewedBy',
        'onboarding.reviewedAt',
        'onboarding.rejectedAt',
        'onboarding.canRetryAfter',
        'onboarding.createdAt',
        'account.name',
        'account.email',
        'account.phone',
        'account.isVerified',
        'account.status',
        'details.aadharNo',
        'details.aadharDoc',
        'details.aadharUrl',
        'details.panNo',
        'details.panDoc',
        'details.panUrl',
        'details.gstNo',
        'details.gstDoc',
        'details.gstUrl',
        'details.licenceNo',
        'details.licenceDoc',
        'details.licenceUrl',
        'details.selfieDoc',
        'details.selfieUrl'
      ])
      .where('onboarding.accountId = :accountId', { accountId })
      .getOne();
  }

  async getMyOnboardingStatus(accountId: string) {
    return this.onboardingRepo
      .createQueryBuilder('onboarding')
      .select([
        'onboarding.id',
        'onboarding.userRole',
        'onboarding.onboardingStatus',
        'onboarding.adminRemark',
        'onboarding.reviewedAt',
        'onboarding.canRetryAfter',
        'onboarding.createdAt'
      ])
      .where('onboarding.accountId = :accountId', { accountId })
      .getOne();
  }

  private getRequiredDocuments(userRole: UserRole): DocumentType[] {
    const required = [DocumentType.SELFIE, DocumentType.AADHAR];
    
    if ([UserRole.VENDOR, UserRole.TOWING_PROVIDER, UserRole.CAR_DETAILER].includes(userRole)) {
      required.push(DocumentType.PAN);
    }
    
    if (userRole === UserRole.VENDOR) {
      required.push(DocumentType.GST);
    }
    
    if (userRole === UserRole.TOWING_PROVIDER) {
      required.push(DocumentType.LICENCE);
    }
    
    return required;
  }

  private getUploadedDocuments(userDetails: UserAdditionalDetail): DocumentType[] {
    const uploaded: DocumentType[] = [];
    
    if (userDetails.selfieDoc) uploaded.push(DocumentType.SELFIE);
    if (userDetails.aadharDoc) uploaded.push(DocumentType.AADHAR);
    if (userDetails.panDoc) uploaded.push(DocumentType.PAN);
    if (userDetails.gstDoc) uploaded.push(DocumentType.GST);
    if (userDetails.licenceDoc) uploaded.push(DocumentType.LICENCE);
    
    return uploaded;
  }
}