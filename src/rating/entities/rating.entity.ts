import { Column, Entity, ManyToOne } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { Account } from 'src/account/entities/account.entity';
import { ServiceRequest } from 'src/service-request/entities/service-request.entity';

@Entity()
export class Rating extends AppBaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  providerId: string;

  @Column({ type: 'uuid' })
  serviceRequestId: string;

  @Column({ type: 'int', width: 1 })
  rating: number; // 1-5 stars

  @Column({ type: 'text', nullable: true })
  comment: string;

  @ManyToOne(() => Account, (account) => account.givenRatings, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: Account;

  @ManyToOne(() => Account, (account) => account.receivedRatings, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  provider: Account;

  @ManyToOne(() => ServiceRequest, (serviceRequest) => serviceRequest.rating, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  serviceRequest: ServiceRequest;
}