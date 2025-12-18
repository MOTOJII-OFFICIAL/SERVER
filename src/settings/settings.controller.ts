import { Controller, Get, Patch, Body, UseGuards, Request, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, Put } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getPublicSettings() {
    return this.settingsService.getPublicSettings();
  }

  @Get('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  getAdminSettings() {
    return this.settingsService.getSettings();
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  updateSettings(@Request() req, @Body() updateDto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(updateDto, req.user.id);
  }

  @Put('upload-logo')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/Settings',
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `logo-${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadLogo(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.settingsService.uploadLogo(file.path, req.user.id);
  }

  @Put('upload-favicon')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/Settings',
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `favicon-${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadFavicon(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 1 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.settingsService.uploadFavicon(file.path, req.user.id);
  }

  @Patch('toggle-maintenance')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  toggleMaintenanceMode(@Request() req) {
    return this.settingsService.toggleMaintenanceMode(req.user.id);
  }

  @Patch('toggle-payment')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  togglePayment(@Request() req) {
    return this.settingsService.togglePayment(req.user.id);
  }

  @Patch('toggle-registration')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  toggleRegistration(@Request() req) {
    return this.settingsService.toggleRegistration(req.user.id);
  }

  @Patch('toggle-razorpay')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  toggleRazorpay(@Request() req) {
    return this.settingsService.toggleRazorpay(req.user.id);
  }

  @Patch('toggle-stripe')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  toggleStripe(@Request() req) {
    return this.settingsService.toggleStripe(req.user.id);
  }

  @Patch('toggle-paytm')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  togglePaytm(@Request() req) {
    return this.settingsService.togglePaytm(req.user.id);
  }

  @Patch('toggle-cod')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  toggleCOD(@Request() req) {
    return this.settingsService.toggleCOD(req.user.id);
  }

  @Patch('toggle-platform-fee')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  togglePlatformFee(@Request() req) {
    return this.settingsService.togglePlatformFee(req.user.id);
  }

  @Patch('toggle-email-verification')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  toggleEmailVerification(@Request() req) {
    return this.settingsService.toggleEmailVerification(req.user.id);
  }

  @Patch('toggle-phone-verification')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  togglePhoneVerification(@Request() req) {
    return this.settingsService.togglePhoneVerification(req.user.id);
  }

  @Patch('toggle-force-update')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  toggleForceUpdate(@Request() req) {
    return this.settingsService.toggleForceUpdate(req.user.id);
  }
}