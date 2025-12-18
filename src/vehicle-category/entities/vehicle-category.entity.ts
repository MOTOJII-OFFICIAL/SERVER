import { Column, Entity, OneToMany } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { CarType } from 'src/car-type/entities/car-type.entity';
import { ServiceVehicleCategory } from 'src/service-vehicle-category/entities/service-vehicle-category.entity';

@Entity('vehicle_categories')
export class VehicleCategory extends AppBaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  iconPath: string;

  @Column({ nullable: true })
  iconUrl: string;

  @OneToMany(() => CarType, (carType) => carType.vehicleCategory)
  carTypes: CarType[];

  @OneToMany(() => ServiceVehicleCategory, (svc) => svc.vehicleCategory)
  serviceVehicleCategories: ServiceVehicleCategory[];
}