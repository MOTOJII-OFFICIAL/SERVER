import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, Put, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  // CREATE (Admin only)
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createDto: CreateServiceDto) {
    return this.serviceService.create(createDto);
  }

  // READ (Public)
  @Get()
  findAll(@Query('categoryId') categoryId?: string) {
    return this.serviceService.findAll(categoryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  // UPDATE (Admin only)
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateDto);
  }

  @Put('upload-icon/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/Service',
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
    return this.serviceService.uploadIcon(id, file.path);
  }

  // Provider service management
  @Post('provider')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.MECANIC, UserRole.TOWING_PROVIDER, UserRole.CAR_DETAILER, UserRole.VENDOR)
  createProviderService(@Request() req, @Body() createDto: CreateServiceDto) {
    return this.serviceService.createProviderService(req.user.id, createDto);
  }

  @Get('provider/my-services')
  @UseGuards(AuthGuard('jwt'))
  findMyServices(@Request() req) {
    return this.serviceService.findProviderServices(req.user.id);
  }

  @Get('provider/:providerId')
  findProviderServices(@Param('providerId') providerId: string) {
    return this.serviceService.findServicesByProvider(providerId);
  }

  // DELETE (Admin only)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }
}