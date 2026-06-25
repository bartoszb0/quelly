import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
  },
})
export class RealtimeGateway {
  @WebSocketServer() server!: Server;

  @SubscribeMessage('joinShop')
  handleJoinOrder(client: Socket, payload: { shopPublicId: string }) {
    client.join(`shop:${payload.shopPublicId}`);
  }

  notifyQueueChange(shopPublicId: string) {
    this.server.to(`shop:${shopPublicId}`).emit('queueChange');
  }
}
