import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { EmailConfigService } from 'src/email-config/email-config.service';
import { OtpType } from 'src/enum';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor(private readonly emailConfigService: EmailConfigService) {
    this.initializeTransporter();
  }

  private async initializeTransporter(): Promise<void> {
    const config = await this.emailConfigService.getConfig();
    this.transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.useSSL,
      auth: {
        user: config.smtpUsername,
        pass: config.smtpPassword,
      },
    });
  }

  async sendOTP(email: string, otp: string, type: OtpType): Promise<boolean> {
    try {
      const config = await this.emailConfigService.getConfig();
      const subject = type === OtpType.REGISTER ? 'Registration OTP' : 'Login OTP';
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your OTP Code</h2>
          <p>Your OTP code is: <strong style="font-size: 24px; color: #007bff;">${otp}</strong></p>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `;

      await this.transporter.sendMail({
        from: `${config.fromName} <${config.fromEmail}>`,
        to: email,
        subject,
        html,
      });

      this.logger.log(`OTP sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${email}:`, error);
      return false;
    }
  }
}
