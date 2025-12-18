import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from './entities/settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
  ) {}

  async getSettings(): Promise<Settings> {
    let settings = await this.settingsRepository.findOne({ where: {} });
    
    if (!settings) {
      // Create default settings if none exist
      settings = this.settingsRepository.create({
        appTitle: 'Car Service App',
        welcomeMessage: 'Welcome to our Car Service Platform',
        footerMessage: '© 2024 Car Service App. All rights reserved.',
        maintenanceMode: false,
        allowRegistration: true,
        paymentEnabled: false,
        codEnabled: true,
        serviceTaxPercentage: 18.00,
        defaultCurrency: 'INR',
        maxServiceRadius: 50,
      });
      settings = await this.settingsRepository.save(settings);
    }
    
    return settings;
  }

  async updateSettings(updateDto: UpdateSettingsDto, adminId: string): Promise<Settings> {
    let settings = await this.settingsRepository.findOne({ where: {} });
    
    if (!settings) {
      settings = this.settingsRepository.create(updateDto);
      settings.createdBy = adminId;
    } else {
      Object.assign(settings, updateDto);
      settings.updatedBy = adminId;
    }
    
    return this.settingsRepository.save(settings);
  }

  async uploadLogo(logoPath: string, adminId: string): Promise<Settings> {
    const settings = await this.getSettings();
    settings.logoPath = logoPath;
    settings.logoUrl = process.env.MJ_CDN_LINK + logoPath;
    settings.updatedBy = adminId;
    return this.settingsRepository.save(settings);
  }

  async uploadFavicon(faviconPath: string, adminId: string): Promise<Settings> {
    const settings = await this.getSettings();
    settings.faviconPath = faviconPath;
    settings.faviconUrl = process.env.MJ_CDN_LINK + faviconPath;
    settings.updatedBy = adminId;
    return this.settingsRepository.save(settings);
  }

  async getPublicSettings(): Promise<Partial<Settings>> {
    const settings = await this.getSettings();
    
    // Return only public settings (hide sensitive data)
    return {
      appTitle: settings.appTitle,
      marqueeText: settings.marqueeText,
      logoUrl: settings.logoUrl,
      faviconUrl: settings.faviconUrl,
      businessAddress: settings.businessAddress,
      primaryPhone: settings.primaryPhone,
      businessEmail: settings.businessEmail,
      facebookUrl: settings.facebookUrl,
      instagramUrl: settings.instagramUrl,
      twitterUrl: settings.twitterUrl,
      whatsappNumber: settings.whatsappNumber,
      welcomeMessage: settings.welcomeMessage,
      footerMessage: settings.footerMessage,
      privacyPolicyUrl: settings.privacyPolicyUrl,
      termsConditionsUrl: settings.termsConditionsUrl,
      aboutUsText: settings.aboutUsText,
      maintenanceMode: settings.maintenanceMode,
      maintenanceMessage: settings.maintenanceMessage,
      allowRegistration: settings.allowRegistration,
      serviceTaxPercentage: settings.serviceTaxPercentage,
      minimumOrderAmount: settings.minimumOrderAmount,
      deliveryCharges: settings.deliveryCharges,
      freeDeliveryAbove: settings.freeDeliveryAbove,
      defaultCurrency: settings.defaultCurrency,
      paymentEnabled: settings.paymentEnabled,
      razorpayEnabled: settings.razorpayEnabled,
      codEnabled: settings.codEnabled,
      defaultLatitude: settings.defaultLatitude,
      defaultLongitude: settings.defaultLongitude,
      maxServiceRadius: settings.maxServiceRadius,
      appVersion: settings.appVersion,
      forceUpdate: settings.forceUpdate,
      updateMessage: settings.updateMessage,
      androidAppUrl: settings.androidAppUrl,
      iosAppUrl: settings.iosAppUrl,
    };
  }

  async toggleMaintenanceMode(adminId: string): Promise<Settings> {
    const settings = await this.getSettings();
    settings.maintenanceMode = !settings.maintenanceMode;
    settings.updatedBy = adminId;
    return this.settingsRepository.save(settings);
  }

  async togglePayment(adminId: string): Promise<Settings> {
    const settings = await this.getSettings();
    settings.paymentEnabled = !settings.paymentEnabled;
    settings.updatedBy = adminId;
    return this.settingsRepository.save(settings);
  }

  async toggleRegistration(adminId: string): Promise<Settings> {
    const settings = await this.getSettings();
    settings.allowRegistration = !settings.allowRegistration;
    settings.updatedBy = adminId;
    return this.settingsRepository.save(settings);
  }

  async toggleRazorpay(adminId: string): Promise<Settings> {
    const settings = await this.getSettings();
    settings.razorpayEnabled = !settings.razorpayEnabled;
    settings.updatedBy = adminId;
    return this.settingsRepository.save(settings);
  }

  async toggleStripe(adminId: string): Promise<Settings> {
    const settings = await this.getSettings();
    settings.stripeEnabled = !settings.stripeEnabled;
    settings.updatedBy = adminId;
    return this.settingsRepository.save(settings);
  }

  async togglePaytm(adminId: string): Promise<Settings> {
    const settings = await this.getSettings();
    settings.paytmEnabled = !settings.paytmEnabled;
    settings.updatedBy = adminId;
    return this.settingsRepository.save(settings);
  }

  async toggleCOD(adminId: string): Promise<Settings> {
    const settings = await this.getSettings();
    settings.codEnabled = !settings.codEnabled;
    settings.updatedBy = adminId;
    return this.settingsRepository.save(settings);
  }

  async togglePlatformFee(adminId: string): Promise<Settings> {
    const settings = await this.getSettings();
    settings.platformFeeEnabled = !settings.platformFeeEnabled;
    settings.updatedBy = adminId;
    return this.settingsRepository.save(settings);
  }

  async toggleEmailVerification(adminId: string): Promise<Settings> {
    const settings = await this.getSettings();
    settings.emailVerificationRequired = !settings.emailVerificationRequired;
    settings.updatedBy = adminId;
    return this.settingsRepository.save(settings);
  }

  async togglePhoneVerification(adminId: string): Promise<Settings> {
    const settings = await this.getSettings();
    settings.phoneVerificationRequired = !settings.phoneVerificationRequired;
    settings.updatedBy = adminId;
    return this.settingsRepository.save(settings);
  }

  async toggleForceUpdate(adminId: string): Promise<Settings> {
    const settings = await this.getSettings();
    settings.forceUpdate = !settings.forceUpdate;
    settings.updatedBy = adminId;
    return this.settingsRepository.save(settings);
  }
}