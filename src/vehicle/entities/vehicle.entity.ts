import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { Account } from 'src/account/entities/account.entity';
import { ServiceRequest } from 'src/service-request/entities/service-request.entity';
import { VehicleCategory, CarType } from 'src/enum';

@Entity('vehicles')
export class Vehicle extends AppBaseEntity {
  @Column({ type: 'uuid' })
  accountId: string;

  @Column({ type: 'enum', enum: VehicleCategory })
  category: VehicleCategory;

  @Column({ type: 'enum', enum: CarType, nullable: true })
  carType: CarType;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  plateNumber: string;

  @Column({ default: false })
  isDefault: boolean;

  @ManyToOne(() => Account, (account) => account.vehicles)
  account: Account;

  @OneToMany(() => ServiceRequest, (serviceRequest) => serviceRequest.vehicle)
  serviceRequests: ServiceRequest[];
}