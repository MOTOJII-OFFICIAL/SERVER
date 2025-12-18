import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { Account } from 'src/account/entities/account.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Service } from 'src/service/entities/service.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { RequestStatus } from 'src/enum';

@Entity()
export class ServiceRequest extends AppBaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  providerId: string;

  @Column({ type: 'uuid' })
  vehicleId: string;

  @Column({ type: 'uuid' })
  serviceId: string;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
  requestStatus: RequestStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  finalPrice: number;

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @ManyToOne(() => Account, (account) => account.userRequests, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: Account;

  @ManyToOne(() => Account, (account) => account.providerRequests, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  provider: Account;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.serviceRequests, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  vehicle: Vehicle;

  @ManyToOne(() => Service, (service) => service.serviceRequests, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  service: Service;

  @OneToOne(() => Rating, (rating) => rating.serviceRequest)
  rating: Rating;
}