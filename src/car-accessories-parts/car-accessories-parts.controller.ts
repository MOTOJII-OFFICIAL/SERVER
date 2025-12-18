import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Request, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, Put } from '@nestjs/common';
import { CarAccessoriesPartsService } from './car-accessories-parts.service';
import { CreateCarAccessoriesPartsDto, QueryDto } from './dto/create-car-accessories-parts.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { IsInt, Min } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

class UpdateStockDto {
  @IsInt()
  @Min(0)
  stockQuantity: number;
}

@Controller('car-accessories-parts')
export class CarAccessoriesPartsController {
  constructor(private readonly partsService: CarAccessoriesPartsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  create(@Request() req, @Body() createDto: CreateCarAccessoriesPartsDto) {
    return this.partsService.create(req.user.id, createDto);
  }

  @Get()
  findAll(@Query() paginationDto: QueryDto ) {
    return this.partsService.findAll(paginationDto);
  }

  @Get('vendor/my-parts')
  @UseGuards(JwtAuthGuard)
  findMyParts(@Request() req) {
    return this.partsService.findVendorParts(req.user.id);
  }

  @Get('vendor/:vendorId')
  findVendorParts(@Param('vendorId') vendorId: string) {
    return this.partsService.findByVendor(vendorId);
  }

  @Patch('stock/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  updateStock(@Request() req, @Param('id') id: string, @Body() dto: UpdateStockDto) {
    return this.partsService.updateStock(id, req.user.id, dto.stockQuantity);
  }

  @Put('upload-image/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/Parts',
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
  async uploadImage(
    @Request() req,
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
    const part = await this.partsService.findOne(id);
    return this.partsService.uploadImage(file.path, part);
  }

  @Get('admin/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findPendingParts() {
    return this.partsService.findPendingParts();
  }

  @Patch('admin/approve/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  approvePart(@Request() req, @Param('id') id: string) {
    return this.partsService.approvePart(id, req.user.id);
  }

  @Patch('admin/reject/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  rejectPart(@Request() req, @Param('id') id: string) {
    return this.partsService.rejectPart(id, req.user.id);
  }
}