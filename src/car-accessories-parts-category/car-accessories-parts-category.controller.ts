import { Controller, Get, Post, Body, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, Put, Param } from '@nestjs/common';
import { CarAccessoriesPartsCategoryService } from './car-accessories-parts-category.service';
import { CreateCarAccessoriesPartsCategoryDto } from './dto/create-car-accessories-parts-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('car-accessories-parts-categories')
export class CarAccessoriesPartsCategoryController {
  constructor(private readonly categoryService: CarAccessoriesPartsCategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createDto: CreateCarAccessoriesPartsCategoryDto) {
    return this.categoryService.create(createDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Put('upload-icon/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/PartsCategory',
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
    return this.categoryService.uploadIcon(id, file.path);
  }
}