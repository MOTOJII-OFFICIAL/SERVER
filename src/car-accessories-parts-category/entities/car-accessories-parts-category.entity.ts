import { Column, Entity, OneToMany } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { CarAccessoriesParts } from 'src/car-accessories-parts/entities/car-accessories-parts.entity';

@Entity()
export class CarAccessoriesPartsCategory extends AppBaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  iconPath: string;

  @Column({ nullable: true })
  iconUrl: string;

  @OneToMany(() => CarAccessoriesParts, (part) => part.category)
  parts: CarAccessoriesParts[];
}