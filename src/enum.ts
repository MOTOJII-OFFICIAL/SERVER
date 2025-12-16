export enum DefaultStatus {
    ACTIVE = 'ACTIVE',
    BLOCKED = 'BLOCKED',
    SUSPENDED = 'SUSPENDED',
    PENDING = 'PENDING',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
}

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
    MECANIC = 'MECHANIC',
    VENDOR = 'VENDOR',
    TOWING_PROVIDER = 'TOWING_PROVIDER',
    CAR_DETAILER = 'CAR_DETAILER',
}

export enum PermissionAction {
    CREATE = 'CREATE',
    READ = 'READ',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
}

export enum OtpType {
    ADMIN = 'admin',
    USER = 'user',
    REGISTER = 'register',
}

export enum AddressType {
    HOME = 'HOME',
    WORK = 'WORK',
    OTHER = 'OTHER',
}