import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { Account } from 'src/account/entities/account.entity';
import { PartsOrderItem } from './parts-order-item.entity';
import { OrderStatus } from 'src/enum';

@Entity()
export class PartsOrder extends AppBaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', unique: true })
  orderNumber: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  orderStatus: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  shippingAddress: string;

  @Column({ type: 'timestamp', nullable: true })
  shippedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @ManyToOne(() => Account, (account) => account.partsOrders, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: Account;

  @OneToMany(() => PartsOrderItem, (item) => item.order)
  orderItems: PartsOrderItem[];
}