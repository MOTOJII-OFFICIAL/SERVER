import { Column, Entity, ManyToOne } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { Account } from 'src/account/entities/account.entity';
import { CarAccessoriesParts } from 'src/car-accessories-parts/entities/car-accessories-parts.entity';

@Entity()
export class ProductRating extends AppBaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  productId: string;

  @Column({ type: 'int', width: 1 })
  rating: number; // 1-5 stars

  @Column({ type: 'text', nullable: true })
  review: string;

  @ManyToOne(() => Account, (account) => account.productRatings, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: Account;

  @ManyToOne(() => CarAccessoriesParts, (product) => product.productRatings, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  product: CarAccessoriesParts;
}