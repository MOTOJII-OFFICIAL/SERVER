import { Column, Entity, OneToMany } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { Service } from 'src/service/entities/service.entity';

@Entity('service_categories')
export class ServiceCategory extends AppBaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  iconPath: string;

  @Column({ nullable: true })
  iconUrl: string;

  @OneToMany(() => Service, (service) => service.serviceCategory)
  services: Service[];
}