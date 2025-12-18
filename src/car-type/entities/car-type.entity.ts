import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { VehicleCategory } from 'src/vehicle-category/entities/vehicle-category.entity';
import { ServiceCarType } from 'src/service-car-type/entities/service-car-type.entity';

@Entity('car_types')
export class CarType extends AppBaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  iconPath: string;

  @Column({ nullable: true })
  iconUrl: string;

  @Column({ type: 'uuid' })
  vehicleCategoryId: string;

  @ManyToOne(() => VehicleCategory, (category) => category.carTypes)
  vehicleCategory: VehicleCategory;

  @OneToMany(() => ServiceCarType, (sct) => sct.carType)
  serviceCarTypes: ServiceCarType[];
}