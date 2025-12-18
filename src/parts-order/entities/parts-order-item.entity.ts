import { Column, Entity, ManyToOne } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { PartsOrder } from './parts-order.entity';
import { CarAccessoriesParts } from 'src/car-accessories-parts/entities/car-accessories-parts.entity';

@Entity()
export class PartsOrderItem extends AppBaseEntity {
  @Column({ type: 'uuid' })
  orderId: string;

  @Column({ type: 'uuid' })
  partId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @ManyToOne(() => PartsOrder, (order) => order.orderItems, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  order: PartsOrder;

  @ManyToOne(() => CarAccessoriesParts, (part) => part.orderItems, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  part: CarAccessoriesParts;
}