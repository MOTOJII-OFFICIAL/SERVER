import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from 'src/shared/entity/AppBaseEntity';

@Entity()
export class Settings extends AppBaseEntity {
  // App Basic Info
  @Column({ default: 'Car Service App' })
  appTitle: string;

  @Column({ type: 'text', nullable: true })
  marqueeText: string;

  @Column({ nullable: true })
  logoPath: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  faviconPath: string;

  @Column({ nullable: true })
  faviconUrl: string;

  // Contact Details
  @Column({ type: 'text', nullable: true })
  businessAddress: string;

  @Column({ nullable: true })
  primaryPhone: string;

  @Column({ nullable: true })
  secondaryPhone: string;

  @Column({ nullable: true })
  businessEmail: string;

  @Column({ nullable: true })
  supportEmail: string;

  // Social Media Links
  @Column({ nullable: true })
  facebookUrl: string;

  @Column({ nullable: true })
  instagramUrl: string;

  @Column({ nullable: true })
  twitterUrl: string;

  @Column({ nullable: true })
  linkedinUrl: string;

  @Column({ nullable: true })
  youtubeUrl: string;

  @Column({ nullable: true })
  whatsappNumber: string;

  // App Messages
  @Column({ type: 'text', nullable: true })
  welcomeMessage: string;

  @Column({ type: 'text', nullable: true })
  footerMessage: string;

  @Column({ type: 'text', nullable: true })
  privacyPolicyUrl: string;

  @Column({ type: 'text', nullable: true })
  termsConditionsUrl: string;

  @Column({ type: 'text', nullable: true })
  aboutUsText: string;

  // App Control
  @Column({ default: false })
  maintenanceMode: boolean;

  @Column({ type: 'text', nullable: true })
  maintenanceMessage: string;

  @Column({ default: true })
  allowRegistration: boolean;

  @Column({ default: true })
  emailVerificationRequired: boolean;

  @Column({ default: true })
  phoneVerificationRequired: boolean;

  // Business Settings
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  serviceTaxPercentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  minimumOrderAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  deliveryCharges: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 500.00 })
  freeDeliveryAbove: number;

  @Column({ default: 'INR' })
  defaultCurrency: string;

  @Column({ default: 'Asia/Kolkata' })
  defaultTimezone: string;

  // Platform Fee Settings
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  platformFeePercentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  platformFeeFixed: number;

  @Column({ default: false })
  platformFeeEnabled: boolean;

  // Payment Settings
  @Column({ default: false })
  paymentEnabled: boolean;

  @Column({ default: false })
  razorpayEnabled: boolean;

  @Column({ nullable: true })
  razorpayKeyId: string;

  @Column({ nullable: true })
  razorpayKeySecret: string;

  @Column({ default: false })
  stripeEnabled: boolean;

  @Column({ nullable: true })
  stripePublishableKey: string;

  @Column({ nullable: true })
  stripeSecretKey: string;

  @Column({ default: false })
  paytmEnabled: boolean;

  @Column({ nullable: true })
  paytmMerchantId: string;

  @Column({ nullable: true })
  paytmMerchantKey: string;

  @Column({ default: true })
  codEnabled: boolean; // Cash on Delivery

  // Email Configuration
  @Column({ nullable: true })
  emailProvider: string; // 'smtp', 'gmail', 'outlook'

  @Column({ nullable: true })
  emailHost: string;

  @Column({ nullable: true })
  emailPort: string;

  @Column({ nullable: true })
  emailUsername: string;

  @Column({ nullable: true })
  emailPassword: string;

  @Column({ default: false })
  emailSecure: boolean;

  @Column({ nullable: true })
  emailFromName: string;

  @Column({ nullable: true })
  emailFromAddress: string;

  // SMS Configuration
  @Column({ nullable: true })
  smsProvider: string; // 'twilio', 'aws-sns', 'textlocal'

  @Column({ nullable: true })
  smsApiKey: string;

  @Column({ nullable: true })
  smsApiSecret: string;

  @Column({ nullable: true })
  smsSenderId: string;

  // App Store Links
  @Column({ nullable: true })
  androidAppUrl: string;

  @Column({ nullable: true })
  iosAppUrl: string;

  // Location Settings
  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  defaultLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  defaultLongitude: number;

  @Column({ type: 'int', default: 50 })
  maxServiceRadius: number; // in kilometers

  // Version Control
  @Column({ default: '1.0.0' })
  appVersion: string;

  @Column({ default: '1.0.0' })
  apiVersion: string;

  @Column({ default: false })
  forceUpdate: boolean;

  @Column({ nullable: true })
  updateMessage: string;
}