import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { MessageType } from '../common/enum/message_type.enum';
import { SendMessageDto } from '../common/request/chat/send_message.dto';
import { JwtAcessTokenAuthGuard, JwtRequest } from '../security/guards/jwt_access.guard';
import { ChatService } from '../services/core/chat.service';
import { SocketService } from '../services/core/socket.service';

@UseGuards(JwtAcessTokenAuthGuard)
@Controller('/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService, private readonly socketService: SocketService) {}

  @Post('/send-message')
  async sendMessage(@Body() data: SendMessageDto, @Req() req: JwtRequest) {
    const payload = req.jwtPayload;

    //	check if user is in that chat table by checking chatHeadId in chat participants
    const participants = await this.chatService.userBelongsToChatHead(payload.id, data.partnerId, data.chatHeadId);

    //	update table messages by my own id from token, chatHeadId and stuff
    const chatMessage = await this.chatService.insertMessage(payload.id, data.chatHeadId, data.message);

    //	send message via socket
    this.socketService.sendMessageToUser(participants.partner.user.socket_id, {
      messageType: MessageType.TEXT,
      textMessage: data.message,
    });

    //! for now
    return { participants, chatMessage };
  }
}
