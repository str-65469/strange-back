import { Connection } from 'typeorm';
import { ChatHeadService } from './chat/chat_head.service';
import { ChatMessagesService } from './chat/chat_messages.service';
import { ChatParticipantsService } from './chat/chat_participants.service';
export declare class ChatService {
    private readonly chatParticipantsService;
    private readonly chatMessagesService;
    private readonly chatHeadService;
    private readonly connection;
    constructor(chatParticipantsService: ChatParticipantsService, chatMessagesService: ChatMessagesService, chatHeadService: ChatHeadService, connection: Connection);
    userBelongsToChatHead(userId: number, partnerId: number, chatHeadId: number): Promise<{
        user: import("../../../database/entity/chat/chat_participants.entity").ChatParticipants;
        partner: import("../../../database/entity/chat/chat_participants.entity").ChatParticipants;
    }>;
    insertMessage(userId: number, chatHeadId: number, message: string): Promise<import("../../../database/entity/chat/chat_messages.entity").ChatMessages>;
    createChatTables(userId: number, partnerId: number): Promise<void>;
    getChatheads(userId: number): Promise<import("../../../database/entity/chat/chat_heads.entity").ChatHeads[]>;
    getMessages(userId: number, chatHeadId: number, take: number, lastId?: number): Promise<import("../../common/schemas/pagination").Pagination>;
}
