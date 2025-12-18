import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    private notificationGateway: NotificationGateway,
  ) {}

  async create(createDto: CreateNotificationDto) {
    const notification = this.notificationRepo.create(createDto);
    await this.notificationRepo.save(notification);

    if (createDto.accountId) {
      this.notificationGateway.sendToUser(createDto.accountId, notification);
    }

    return notification;
  }

  async broadcast(title: string, message: string) {
    const notification = { title, message, createdAt: new Date() };
    this.notificationGateway.broadcastToAll(notification);
    return { message: 'Broadcast sent successfully' };
  }

  async getUserNotifications(accountId: string, paginationDto?: PaginationDto) {
    if (!paginationDto) {
      return this.notificationRepo.find({
        where: { accountId },
        order: { createdAt: 'DESC' },
        take: 50,
      });
    }

    const query = this.notificationRepo
      .createQueryBuilder('notification')
      .select([
        'notification.id',
        'notification.title',
        'notification.message',
        'notification.type',
        'notification.isRead',
        'notification.createdAt'
      ])
      .where('notification.accountId = :accountId', { accountId })
      .orderBy('notification.createdAt', 'DESC');

    if (paginationDto.keyword) {
      query.andWhere(new Brackets(qb => {
        qb.where('notification.title ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` })
          .orWhere('notification.message ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` });
      }));
    }

    const [result, count] = await query
      .skip(paginationDto.offset)
      .take(paginationDto.limit)
      .getManyAndCount();

    return { result, count };
  }

  async markAsRead(id: string) {
    await this.notificationRepo.update(id, { isRead: true });
    return { message: 'Notification marked as read' };
  }

  async getUnreadCount(accountId: string) {
    const count = await this.notificationRepo.count({
      where: { accountId, isRead: false },
    });
    return { count };
  }
}
