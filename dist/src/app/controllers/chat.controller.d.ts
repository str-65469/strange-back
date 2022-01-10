import { GetMessagesDto } from '../common/request/chat/get_messages.dto';
import { SendMessageDto } from '../common/request/chat/send_message.dto';
import { JwtRequest } from '../security/guards/jwt_access.guard';
import { ChatService } from '../services/core/chat.service';
import { SocketService } from '../services/core/socket.service';
export declare class ChatController {
    private readonly chatService;
    private readonly socketService;
    constructor(chatService: ChatService, socketService: SocketService);
    sendMessage(chatHeadId: number, partnerId: number, data: SendMessageDto, req: JwtRequest): Promise<import("../../database/entity/chat/chat_messages.entity").ChatMessages>;
    getChats(req: JwtRequest): Promise<import("../../database/entity/chat/chat_heads.entity").ChatHeads[]>;
    getMessages(req: JwtRequest, chatHeadId: number, getMessagesDto: GetMessagesDto): Promise<import("../common/schemas/pagination").Pagination>;
}
