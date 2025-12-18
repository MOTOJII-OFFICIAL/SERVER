import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from 'src/auth/guards/ws-jwt.guard';

@WebSocketGateway({ cors: true, namespace: '/notifications' })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('NotificationGateway');

  @UseGuards(WsJwtGuard)
  handleConnection(client: Socket) {
    try {
      const accountId = client['user']?.id;
      if (accountId) {
        client.join(`user_${accountId}`);
        this.logger.log(`Account ${accountId} connected to notifications`);
      }
    } catch (error) {
      this.logger.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const accountId = client['user']?.id;
    if (accountId) {
      this.logger.log(`Account ${accountId} disconnected from notifications`);
    }
  }

  sendToUser(accountId: string, notification: any) {
    this.server.to(`user_${accountId}`).emit('notification', notification);
  }

  broadcastToAll(notification: any) {
    this.server.emit('notification', notification);
  }
}
