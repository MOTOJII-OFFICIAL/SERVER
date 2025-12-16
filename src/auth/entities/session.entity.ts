import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';

@Entity('sessions')
export class Session extends AppBaseEntity {
    @Column()
    token: string;

    @Column()
    refreshToken: string;

    @Column()
    expiresAt: Date;

    @Column()
    refreshExpiresAt: Date;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Account)
    @JoinColumn({ name: 'accountId' })
    account: Account;

    @Column()
    accountId: string;
}
