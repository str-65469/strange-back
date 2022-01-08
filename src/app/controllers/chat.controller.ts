import { Body, Controller, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { MessageType } from '../common/enum/message_type.enum';
import { GetMessagesDto } from '../common/request/chat/get_messages.dto';
import { SendMessageDto } from '../common/request/chat/send_message.dto';
import { JwtAcessTokenAuthGuard, JwtRequest } from '../security/guards/jwt_access.guard';
import { ChatService } from '../services/core/chat.service';
import { SocketService } from '../services/core/socket.service';

@UseGuards(JwtAcessTokenAuthGuard)
@Controller('/chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly socketService: SocketService,
  ) {}

  @Post('/send-message/:chatHeadId/:partnerId')
  async sendMessage(
    @Param('chatHeadId', ParseIntPipe) chatHeadId: number,
    @Param('partnerId', ParseIntPipe) partnerId: number,
    @Body() data: SendMessageDto,
    @Req() req: JwtRequest,
  ) {
    const payload = req.jwtPayload;

    //	check if user is in that chat table by checking chatHeadId in chat participants
    const participants = await this.chatService.userBelongsToChatHead(payload.id, partnerId, chatHeadId);

    //	update table messages by my own id from token, chatHeadId and stuff
    const chatMessage = await this.chatService.insertMessage(payload.id, chatHeadId, data.message);

    //	send message via socket
    this.socketService.sendMessageToUser(participants.partner.user.socket_id, {
      messageType: MessageType.TEXT,
      textMessage: data.message,
    });

    //! for now
    return { participants, chatMessage };
  }

  @Post('/chat-heads')
  getChats(@Req() req: JwtRequest) {
    const payload = req.jwtPayload;

    return this.chatService.getChatheads(payload.id);
  }

  @Post('/messages/:chatHeadId')
  getMessages(
    @Req() req: JwtRequest,
    @Param('chatHeadId', ParseIntPipe) chatHeadId: number,
    @Query() getMessagesDto: GetMessagesDto,
  ) {
    const payload = req.jwtPayload;
    const { lastId, take } = getMessagesDto;

    return this.chatService.getMessages(payload.id, chatHeadId, take, lastId);
  }
}
