import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserRole } from 'src/enum';
import { NotificationService } from './notification.service';
import { CreateNotificationDto, BroadcastNotificationDto } from './dto/create-notification.dto';
import { Account } from 'src/account/entities/account.entity';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createDto: CreateNotificationDto) {
    return this.notificationService.create(createDto);
  }

  @Post('broadcast')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  broadcast(@Body() broadcastDto: BroadcastNotificationDto) {
    return this.notificationService.broadcast(broadcastDto.title, broadcastDto.message);
  }

  @Get()
  getUserNotifications(@CurrentUser() user: Account) {
    return this.notificationService.getUserNotifications(user.id);
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser() user: Account) {
    return this.notificationService.getUnreadCount(user.id);
  }

  @Patch('read/:id')
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }
}
