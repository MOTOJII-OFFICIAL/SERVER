import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { FAQService } from './faq.service';
import { CreateFAQDto } from './dto/create-faq.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';

@Controller('faq')
export class FAQController {
  constructor(private readonly faqService: FAQService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createDto: CreateFAQDto) {
    return this.faqService.create(createDto);
  }

  @Get()
  findAll(@Query('category') category?: string) {
    return this.faqService.findAll(category);
  }

  @Get('categories')
  findCategories() {
    return this.faqService.findCategories();
  }
}