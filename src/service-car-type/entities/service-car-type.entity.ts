import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Service } from 'src/service/entities/service.entity';
import { CarType } from 'src/car-type/entities/car-type.entity';

@Entity('service_car_types')
export class ServiceCarType {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'uuid' })
  serviceId: string;

  @Column({ type: 'uuid' })
  carTypeId: string;

  @ManyToOne(() => Service, (service) => service.serviceCarTypes, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  service: Service;

  @ManyToOne(() => CarType, (carType) => carType.serviceCarTypes, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  carType: CarType;
}