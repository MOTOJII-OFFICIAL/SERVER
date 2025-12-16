import { UserRole } from "src/enum";
import { AppBaseEntity } from "src/shared/entity/AppBaseEntity";
import { UserPermission } from "src/user-permissions/entities/user-permission.entity";
import { Address } from "src/address/entities/address.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Account extends AppBaseEntity {
    @Column({ type: 'varchar', length: 100, nullable: true })
    username: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    name: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    userRole: UserRole;

    @Column({ type: 'varchar', length: 100, nullable: true })
    ip: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    deviceToken: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    profileImg: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    profileUrl: string;

    @OneToMany(() => UserPermission, (userPermission) => userPermission.account)
    userPermission: UserPermission[];

    @OneToMany(() => Address, (address) => address.account)
    addresses: Address[];
}
