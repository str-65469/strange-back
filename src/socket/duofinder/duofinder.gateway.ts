import { Injectable, Logger } from '@nestjs/common';
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
import { configs } from 'src/configs';

@WebSocketGateway()
export class DuoMatchGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private wss: Server;
  private logger: Logger = new Logger('AppGateway');

  afterInit() {
    this.logger.log('Duo match socket Initialized');
  }

  handleConnection(socket: Socket): void {
    this.logger.log(`Client connected ${socket.id}`);
  }

  @SubscribeMessage(configs.socket.duomatchConnect)
  handleEvent(@MessageBody() data: string): string {
    console.log(123);

    return data;
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected ${client.id}`);
  }
}
