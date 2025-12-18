import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Service } from 'src/service/entities/service.entity';
import { VehicleCategory } from 'src/vehicle-category/entities/vehicle-category.entity';

@Entity('service_vehicle_categories')
export class ServiceVehicleCategory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'uuid' })
  serviceId: string;

  @Column({ type: 'uuid' })
  vehicleCategoryId: string;

  @ManyToOne(() => Service, (service) => service.serviceVehicleCategories, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  service: Service;

  @ManyToOne(() => VehicleCategory, (category) => category.serviceVehicleCategories, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  vehicleCategory: VehicleCategory;
}