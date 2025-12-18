import { UserRole } from "src/enum";
import { AppBaseEntity } from "src/shared/entity/AppBaseEntity";
import { UserPermission } from "src/user-permissions/entities/user-permission.entity";
import { UserAdditionalDetail } from "src/user-additional-details/entities/user-additional-detail.entity";
import { Address } from "src/address/entities/address.entity";
import { Notification } from "src/notification/entities/notification.entity";
import { Vehicle } from "src/vehicle/entities/vehicle.entity";
import { ServiceRequest } from "src/service-request/entities/service-request.entity";
import { Rating } from "src/rating/entities/rating.entity";
import { Service } from "src/service/entities/service.entity";
import { CarAccessoriesParts } from "src/car-accessories-parts/entities/car-accessories-parts.entity";
import { Cart } from "src/cart/entities/cart.entity";
import { PartsOrder } from "src/parts-order/entities/parts-order.entity";
import { ProductRating } from "src/product-rating/entities/product-rating.entity";
import { ContactUs } from "src/contact-us/entities/contact-us.entity";
import { CouponUsage } from "src/coupons/entities/coupon-usage.entity";
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

    @OneToMany(() => UserAdditionalDetail, (userAdditionalDetail) => userAdditionalDetail.account)
    userAdditionalDetails: UserAdditionalDetail[];

    @OneToMany(() => Address, (address) => address.account)
    addresses: Address[];

    @OneToMany(() => Notification, (notification) => notification.account)
    notifications: Notification[];

    @OneToMany(() => Vehicle, (vehicle) => vehicle.account)
    vehicles: Vehicle[];

    @OneToMany(() => ServiceRequest, (serviceRequest) => serviceRequest.user)
    userRequests: ServiceRequest[];

    @OneToMany(() => ServiceRequest, (serviceRequest) => serviceRequest.provider)
    providerRequests: ServiceRequest[];

    @OneToMany(() => Rating, (rating) => rating.user)
    givenRatings: Rating[];

    @OneToMany(() => Rating, (rating) => rating.provider)
    receivedRatings: Rating[];

    @OneToMany(() => Service, (service) => service.provider)
    providerServices: Service[];

    @OneToMany(() => CarAccessoriesParts, (part) => part.vendor)
    vendorParts: CarAccessoriesParts[];

    @OneToMany(() => Cart, (cart) => cart.user)
    cartItems: Cart[];

    @OneToMany(() => PartsOrder, (order) => order.user)
    partsOrders: PartsOrder[];

    @OneToMany(() => ProductRating, (rating) => rating.user)
    productRatings: ProductRating[];

    @OneToMany(() => ContactUs, (contact) => contact.user)
    contactMessages: ContactUs[];

    @OneToMany(() => CouponUsage, (usage) => usage.user)
    couponUsages: CouponUsage[];
}
