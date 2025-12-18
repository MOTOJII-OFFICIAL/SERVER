import { Controller, Get, Post, Body, Param, UseGuards, Request, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, Put } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createDto: CreateCouponDto) {
    return this.couponsService.create(createDto);
  }

  @Get()
  findActive() {
    return this.couponsService.findActive();
  }

  @Get('admin/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.couponsService.findAll();
  }

  @Get('my-coupons')
  @UseGuards(AuthGuard('jwt'))
  getUserCoupons(@Request() req) {
    return this.couponsService.getUserCoupons(req.user.id);
  }

  @Post('apply')
  @UseGuards(AuthGuard('jwt'))
  applyCoupon(@Request() req, @Body() applyDto: ApplyCouponDto) {
    return this.couponsService.applyCoupon(req.user.id, applyDto);
  }

  @Get('admin/stats/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  getCouponStats(@Param('id') id: string) {
    return this.couponsService.getCouponUsageStats(id);
  }

  @Put('upload-icon/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/Coupons',
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadIcon(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.couponsService.uploadIcon(id, file.path);
  }
}