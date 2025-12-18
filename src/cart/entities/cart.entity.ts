import { Column, Entity, ManyToOne } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { Account } from 'src/account/entities/account.entity';
import { CarAccessoriesParts } from 'src/car-accessories-parts/entities/car-accessories-parts.entity';

@Entity()
export class Cart extends AppBaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  partId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ManyToOne(() => Account, (account) => account.cartItems, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: Account;

  @ManyToOne(() => CarAccessoriesParts, (part) => part.cartItems, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  part: CarAccessoriesParts;
}