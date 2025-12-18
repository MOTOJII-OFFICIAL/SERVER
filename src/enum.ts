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

export enum VehicleCategory {
    BIKE = 'BIKE',
    CAR = 'CAR',
}

export enum CarType {
    SEDAN = 'SEDAN',
    HATCHBACK = 'HATCHBACK',
    SUV = 'SUV',
}

export enum WorkingStatus {
    AVAILABLE = 'AVAILABLE',
    BUSY = 'BUSY',
    OFFLINE = 'OFFLINE',
}

export enum RequestStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export enum CouponType {
    PERCENTAGE = 'PERCENTAGE',
    FIXED_AMOUNT = 'FIXED_AMOUNT',
    FREE_DELIVERY = 'FREE_DELIVERY',
}

export enum OnboardingStatus {
    DOCUMENT_PENDING = 'DOCUMENT_PENDING',
    DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
    UNDER_REVIEW = 'UNDER_REVIEW',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export enum DocumentType {
    AADHAR = 'AADHAR',
    PAN = 'PAN',
    GST = 'GST',
    LICENCE = 'LICENCE',
    SELFIE = 'SELFIE',
}