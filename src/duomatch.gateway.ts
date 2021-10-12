import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
  OnGatewayConnection,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class DuoMatchGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private wss: Server;
  private logger: Logger = new Logger('AppGateway');

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket) {
    // this.wss.emit('msgToClient', 'wasssup');
    client.emit('connection', 'Successfully connected');
    this.logger.log(`Client connected ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected ${client.id}`);
  }

  @SubscribeMessage('choice')
  handleEvent(@MessageBody() data: string) {
    return { data, msg: 'hi' };
  }
}
