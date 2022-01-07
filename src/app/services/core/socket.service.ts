import { Injectable } from '@nestjs/common';
import { ChatMessagePayload } from 'src/app/common/schemas/chat_message_payload';
import { SocketGateway } from 'src/app/socket/socket.gateway';
import { configs } from 'src/configs/config';

@Injectable()
export class SocketService {
  constructor(private readonly socketGateway: SocketGateway) {}

  sendMessageToUser(socketId: string, chatMessagePayload: ChatMessagePayload) {
    this.socketGateway.wss.sockets.to(socketId).emit(configs.socket.chat, chatMessagePayload);
  }
}
