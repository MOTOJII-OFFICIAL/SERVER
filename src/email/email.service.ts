import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { EmailConfigService } from 'src/email-config/email-config.service';
import { OtpType, UserRole } from 'src/enum';

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
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendWelcomeEmail(email: string, name: string, userRole: UserRole): Promise<boolean> {
    try {
      await this.initializeTransporter();
      const config = await this.emailConfigService.getConfig();
      const isServiceProvider = [UserRole.MECANIC, UserRole.VENDOR, UserRole.TOWING_PROVIDER, UserRole.CAR_DETAILER].includes(userRole);
      const subject = `Welcome to MOTOJII - ${isServiceProvider ? 'Service Provider' : 'User'} Registration Successful`;
      const currentYear = new Date().getFullYear();
      const currentDateTime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to MOTOJII</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">MOTOJII</h1>
                      <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Your Trusted Car Service Partner</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; text-align: center;">Welcome ${name}! 🎉</h2>
                      <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0; text-align: center;">
                        ${isServiceProvider ? 
                          `Congratulations! Your ${userRole.toLowerCase()} account has been created successfully. To start providing services, please complete your profile and upload required documents for verification.` :
                          'Your account has been created successfully! You can now access all MOTOJII services and book car maintenance, repairs, and more.'
                        }
                      </p>
                      ${isServiceProvider ? `
                      <div style="background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin: 20px 0; border-radius: 4px;">
                        <h3 style="color: #1976d2; margin: 0 0 10px 0; font-size: 16px;">📋 Next Steps:</h3>
                        <ul style="color: #666666; margin: 0; padding-left: 20px;">
                          <li>Complete your profile information</li>
                          <li>Upload required documents (Aadhar, PAN, etc.)</li>
                          <li>Wait for admin verification</li>
                          <li>Start providing services once approved</li>
                        </ul>
                      </div>
                      ` : `
                      <div style="background-color: #e8f5e8; border-left: 4px solid #4caf50; padding: 20px; margin: 20px 0; border-radius: 4px;">
                        <h3 style="color: #388e3c; margin: 0 0 10px 0; font-size: 16px;">🚗 What you can do now:</h3>
                        <ul style="color: #666666; margin: 0; padding-left: 20px;">
                          <li>Book car services and repairs</li>
                          <li>Purchase car accessories and parts</li>
                          <li>Track your service requests</li>
                          <li>Rate and review service providers</li>
                        </ul>
                      </div>
                      `}
                      <p style="color: #999999; font-size: 12px; text-align: center; margin: 20px 0 0 0;">
                        Account created on: ${currentDateTime}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
                      <p style="color: #666666; margin: 0; font-size: 14px; line-height: 1.5;">
                        Need help? Contact our support team<br>
                        <a href="mailto:support@motojii.com" style="color: #667eea; text-decoration: none;">support@motojii.com</a>
                      </p>
                      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                        <p style="color: #999999; margin: 0; font-size: 12px;">
                          © ${currentYear} MOTOJII. All rights reserved.<br>
                          This is an automated message, please do not reply to this email.
                        </p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      await this.transporter.sendMail({
        from: `${config.fromName} <${config.fromEmail}>`,
        to: email,
        subject,
        html,
      });

      this.logger.log(`Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
      return false;
    }
  }

  async sendOTP(email: string, otp: string, type: OtpType): Promise<boolean> {
    try {
      await this.initializeTransporter();
      const config = await this.emailConfigService.getConfig();
      const subject = type === OtpType.REGISTER ? 'Registration OTP' : 'Login OTP';
      const currentYear = new Date().getFullYear();
      const currentDateTime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification - MOTOJII</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">MOTOJII</h1>
                      <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Your Trusted Car Service Partner</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; text-align: center;">Verification Code</h2>
                      <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0; text-align: center;">
                        ${type === OtpType.REGISTER ? 'Welcome to MOTOJII! Please use the verification code below to complete your registration.' : 'Please use the verification code below to sign in to your account.'}
                      </p>
                      <p style="color: #999999; font-size: 12px; text-align: center; margin: 0 0 20px 0;">
                        Generated on: ${currentDateTime}
                      </p>
                      <div style="background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                        <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
                      </div>
                      <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 20px 0; text-align: center;">
                        <strong>This code will expire in 10 minutes</strong><br>
                        For your security, please do not share this code with anyone.
                      </p>
                      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="color: #856404; margin: 0; font-size: 14px;">
                          <strong>⚠️ Security Notice:</strong> If you didn't request this verification code, please ignore this email and ensure your account is secure.
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
                      <p style="color: #666666; margin: 0; font-size: 14px; line-height: 1.5;">
                        Need help? Contact our support team<br>
                        <a href="mailto:support@motojii.com" style="color: #667eea; text-decoration: none;">support@motojii.com</a>
                      </p>
                      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                        <p style="color: #999999; margin: 0; font-size: 12px;">
                          © ${currentYear} MOTOJII. All rights reserved.<br>
                          This is an automated message, please do not reply to this email.
                        </p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
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