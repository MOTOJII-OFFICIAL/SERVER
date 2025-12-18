import { IsString, IsBoolean, IsNumber, IsOptional, IsObject, IsEmail, IsUrl } from 'class-validator';

export class UpdateSettingsDto {
  // App Basic Info
  @IsOptional()
  @IsString()
  appTitle?: string;

  @IsOptional()
  @IsString()
  marqueeText?: string;

  @IsOptional()
  @IsString()
  businessAddress?: string;

  @IsOptional()
  @IsString()
  primaryPhone?: string;

  @IsOptional()
  @IsString()
  secondaryPhone?: string;

  @IsOptional()
  @IsEmail()
  businessEmail?: string;

  @IsOptional()
  @IsEmail()
  supportEmail?: string;

  // Social Media
  @IsOptional()
  @IsUrl()
  facebookUrl?: string;

  @IsOptional()
  @IsUrl()
  instagramUrl?: string;

  @IsOptional()
  @IsUrl()
  twitterUrl?: string;

  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @IsOptional()
  @IsUrl()
  youtubeUrl?: string;

  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  // Messages
  @IsOptional()
  @IsString()
  welcomeMessage?: string;

  @IsOptional()
  @IsString()
  footerMessage?: string;

  @IsOptional()
  @IsString()
  aboutUsText?: string;

  @IsOptional()
  @IsUrl()
  privacyPolicyUrl?: string;

  @IsOptional()
  @IsUrl()
  termsConditionsUrl?: string;

  // App Control
  @IsOptional()
  @IsBoolean()
  maintenanceMode?: boolean;

  @IsOptional()
  @IsString()
  maintenanceMessage?: string;

  @IsOptional()
  @IsBoolean()
  allowRegistration?: boolean;

  @IsOptional()
  @IsBoolean()
  emailVerificationRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  phoneVerificationRequired?: boolean;

  // Business Settings
  @IsOptional()
  @IsNumber()
  serviceTaxPercentage?: number;

  @IsOptional()
  @IsNumber()
  minimumOrderAmount?: number;

  @IsOptional()
  @IsNumber()
  deliveryCharges?: number;

  @IsOptional()
  @IsNumber()
  freeDeliveryAbove?: number;

  @IsOptional()
  @IsString()
  defaultCurrency?: string;

  @IsOptional()
  @IsString()
  defaultTimezone?: string;

  // Platform Fee
  @IsOptional()
  @IsNumber()
  platformFeePercentage?: number;

  @IsOptional()
  @IsNumber()
  platformFeeFixed?: number;

  @IsOptional()
  @IsBoolean()
  platformFeeEnabled?: boolean;

  // Payment Settings
  @IsOptional()
  @IsBoolean()
  paymentEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  razorpayEnabled?: boolean;

  @IsOptional()
  @IsString()
  razorpayKeyId?: string;

  @IsOptional()
  @IsString()
  razorpayKeySecret?: string;

  @IsOptional()
  @IsBoolean()
  stripeEnabled?: boolean;

  @IsOptional()
  @IsString()
  stripePublishableKey?: string;

  @IsOptional()
  @IsString()
  stripeSecretKey?: string;

  @IsOptional()
  @IsBoolean()
  paytmEnabled?: boolean;

  @IsOptional()
  @IsString()
  paytmMerchantId?: string;

  @IsOptional()
  @IsString()
  paytmMerchantKey?: string;

  @IsOptional()
  @IsBoolean()
  codEnabled?: boolean;

  // SMS Configuration
  @IsOptional()
  @IsString()
  smsProvider?: string;

  @IsOptional()
  @IsString()
  smsApiKey?: string;

  @IsOptional()
  @IsString()
  smsApiSecret?: string;

  @IsOptional()
  @IsString()
  smsSenderId?: string;

  // App Store Links
  @IsOptional()
  @IsUrl()
  androidAppUrl?: string;

  @IsOptional()
  @IsUrl()
  iosAppUrl?: string;



  // Location
  @IsOptional()
  @IsNumber()
  defaultLatitude?: number;

  @IsOptional()
  @IsNumber()
  defaultLongitude?: number;

  @IsOptional()
  @IsNumber()
  maxServiceRadius?: number;

  // Version
  @IsOptional()
  @IsString()
  appVersion?: string;

  @IsOptional()
  @IsString()
  apiVersion?: string;

  @IsOptional()
  @IsBoolean()
  forceUpdate?: boolean;

  @IsOptional()
  @IsString()
  updateMessage?: string;
}