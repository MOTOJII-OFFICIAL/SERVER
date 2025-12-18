import { Column, Entity, ManyToOne } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';
import { Account } from 'src/account/entities/account.entity';

@Entity()
export class ContactUs extends AppBaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'text', nullable: true })
  adminReply: string;

  @Column({ type: 'timestamp', nullable: true })
  repliedAt: Date;

  @ManyToOne(() => Account, (account) => account.contactMessages, {
    cascade: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  user: Account;
}