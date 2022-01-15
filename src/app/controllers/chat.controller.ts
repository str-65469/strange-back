import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Query,
    Req,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { GetMessagesDto } from '../schemas/request/chat/get_messages.dto';
import { SendMessageDto } from '../schemas/request/chat/send_message.dto';
import { JwtAcessTokenAuthGuard, JwtRequest } from '../guards/jwt_access.guard';
import { UserSafeInterceptor } from '../interceptors/user_safe.interceptor';
import { ChatService } from '../modules/chat/chat.service';
import { SocketService } from '../modules/socket/socket.service';

@UseGuards(JwtAcessTokenAuthGuard)
@Controller('/chat')
export class ChatController {
    constructor(private readonly chatService: ChatService, private readonly socketService: SocketService) {}

    @Patch('/send-message/:chatHeadId/:partnerId')
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

        // mine just update
        const chatParticipant = await this.chatService.updateLastSeenTimeStamp({
            chatParticipantId: participants.chatParticipantUser.id,
            messageDate: chatMessage.created_at,
        });

        //	send message via socket
        this.socketService.sendMessageToUser(participants.chatParticipantPartner.user.socket_id, chatMessage);

        // return chatmessage
        return { chatMessage, userParticipant: chatParticipant };
    }

    @UseInterceptors(UserSafeInterceptor)
    @Get('/heads')
    getChats(@Req() req: JwtRequest) {
        const payload = req.jwtPayload;

        return this.chatService.getChatheads(payload.id, true);
    }

    @UseInterceptors(UserSafeInterceptor)
    @Get('/messages/:chatHeadId')
    getMessages(
        @Req() req: JwtRequest,
        @Param('chatHeadId', ParseIntPipe) chatHeadId: number,
        @Query() getMessagesDto: GetMessagesDto,
    ) {
        const payload = req.jwtPayload;
        const { lastId, take } = getMessagesDto;

        return this.chatService.getMessages(payload.id, chatHeadId, take, lastId);
    }

    @Patch('/messages/:chatHeadId/update-last-seen')
    async updateLastSeenAt(@Param('chatHeadId', ParseIntPipe) chatHeadId: number, @Req() req: JwtRequest) {
        const payload = req.jwtPayload;

        const chatParticipant = await this.chatService.updateLastSeenTimeStamp({
            userId: payload.id,
            chatHeadId,
        });

        return chatParticipant;
    }
}
