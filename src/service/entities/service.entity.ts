import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { ServiceCategory } from 'src/service-category/entities/service-category.entity';
import { ServiceVehicleCategory } from 'src/service-vehicle-category/entities/service-vehicle-category.entity';
import { ServiceCarType } from 'src/service-car-type/entities/service-car-type.entity';
import { ServiceRequest } from 'src/service-request/entities/service-request.entity';
import { Account } from 'src/account/entities/account.entity';

@Entity('services')
export class Service extends AppBaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ type: 'int' })
  durationMinutes: number;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  iconPath: string;

  @Column({ nullable: true })
  iconUrl: string;

  @Column({ type: 'uuid' })
  serviceCategoryId: string;

  @Column({ type: 'uuid', nullable: true })
  providerId: string;

  @ManyToOne(() => ServiceCategory, (category) => category.services)
  serviceCategory: ServiceCategory;

  @ManyToOne(() => Account, (account) => account.providerServices, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  provider: Account;

  @OneToMany(() => ServiceVehicleCategory, (svc) => svc.service)
  serviceVehicleCategories: ServiceVehicleCategory[];

  @OneToMany(() => ServiceCarType, (sct) => sct.service)
  serviceCarTypes: ServiceCarType[];

  @OneToMany(() => ServiceRequest, (serviceRequest) => serviceRequest.service)
  serviceRequests: ServiceRequest[];
}