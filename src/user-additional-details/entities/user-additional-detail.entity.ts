import { Column, Entity, ManyToOne } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { Account } from 'src/account/entities/account.entity';
import { UserRole } from 'src/enum';

@Entity()
export class UserAdditionalDetail extends AppBaseEntity {
  @Column({ type: 'uuid' })
  accountId: string;

  @Column({ type: 'enum', enum: UserRole })
  userRole: UserRole;

  @Column({ type: 'varchar', length: 500, nullable: true })
  selfieUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  selfieDoc: string;

  // Aadhar (required for all)
  @Column({ type: 'varchar', length: 20, nullable: true })
  aadharNo: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  aadharUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  aadharDoc: string;

  // PAN (required for VENDOR, TOWING_PROVIDER, CAR_DETAILER)
  @Column({ type: 'varchar', length: 20, nullable: true })
  panNo: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  panUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  panDoc: string;

  // GST (required for VENDOR, optional for MECHANIC)
  @Column({ type: 'varchar', length: 30, nullable: true })
  gstNo: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  gstUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gstDoc: string;

  // License (required for TOWING_PROVIDER)
  @Column({ type: 'varchar', length: 30, nullable: true })
  licenceNo: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  licenceUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  licenceDoc: string;

  @ManyToOne(() => Account)
  account: Account;
}