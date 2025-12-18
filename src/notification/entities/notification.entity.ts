import { Column, Entity, ManyToOne } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { Account } from 'src/account/entities/account.entity';

@Entity('notifications')
export class Notification extends AppBaseEntity {
  @Column({ type: 'uuid' })
  accountId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => Account, (account) => account.notifications)
  account: Account;
}
