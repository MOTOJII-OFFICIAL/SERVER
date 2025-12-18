import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { Account } from 'src/account/entities/account.entity';
import { CarAccessoriesPartsCategory } from 'src/car-accessories-parts-category/entities/car-accessories-parts-category.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { PartsOrderItem } from 'src/parts-order/entities/parts-order-item.entity';
import { ProductRating } from 'src/product-rating/entities/product-rating.entity';
import { DefaultStatus } from 'src/enum';

@Entity()
export class CarAccessoriesParts extends AppBaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  partNumber: string;

  @Column({ nullable: true })
  imagePath: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'uuid' })
  vendorId: string;

  @Column({ type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => Account, (account) => account.vendorParts, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  vendor: Account;

  @ManyToOne(() => CarAccessoriesPartsCategory, (category) => category.parts, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  category: CarAccessoriesPartsCategory;

  @OneToMany(() => Cart, (cart) => cart.part)
  cartItems: Cart[];

  @OneToMany(() => PartsOrderItem, (orderItem) => orderItem.part)
  orderItems: PartsOrderItem[];

  @OneToMany(() => ProductRating, (rating) => rating.product)
  productRatings: ProductRating[];
}