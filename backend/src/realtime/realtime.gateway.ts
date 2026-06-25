import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class RealtimeGateway {
  @WebSocketServer() server!: Server;

  // TODO
  // @SubscribeMessage('joinOrder')
  // handleJoinOrder(
  //   client: Socket,
  //   payload: { shopPublicId: string; number: number },
  // ) {
  //   client.join(`order:${payload.shopPublicId}:${payload.number}`);
  // }

  // notifyOrderStatus(shopPublicId: string, number: number, status: string) {
  //   this.server
  //     .to(`order:${shopPublicId}:${number}`)
  //     .emit('orderChange', { status });
  // }
}
