import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { IsString } from 'class-validator';

class ReplyDto {
  @IsString()
  adminReply: string;
}

@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactService: ContactUsService) {}

  @Post()
  create(@Body() createDto: CreateContactUsDto, @Request() req?) {
    const userId = req?.user?.id;
    return this.contactService.create(createDto, userId);
  }

  @Get('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.contactService.findAll();
  }

  @Patch('admin/reply/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  reply(@Request() req, @Param('id') id: string, @Body() dto: ReplyDto) {
    return this.contactService.reply(id, dto.adminReply, req.user.id);
  }
}