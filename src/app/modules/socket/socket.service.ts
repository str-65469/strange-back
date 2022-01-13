import { Injectable } from '@nestjs/common';
import { SocketGateway } from 'src/app/modules/socket/socket.gateway';
import { configs } from 'src/configs/config';
import { ChatMessages } from 'src/database/entity/chat/chat_messages.entity';

@Injectable()
export class SocketService {
  constructor(private readonly socketGateway: SocketGateway) {}

  sendMessageToUser(socketId: string, chatMessage: ChatMessages) {
    this.socketGateway.wss.sockets.to(socketId).emit(configs.socket.chat, chatMessage);
  }
}
