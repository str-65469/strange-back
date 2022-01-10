import { Pagination } from 'src/app/common/schemas/pagination';
import { ChatMessagesRepository } from 'src/app/repositories/chat_messages.repository';
import { ChatMessages } from 'src/database/entity/chat/chat_messages.entity';
export declare class ChatMessagesService {
    private readonly chatMessagesRepo;
    constructor(chatMessagesRepo: ChatMessagesRepository);
    insertMessage(userId: number, chatHeadId: number, message: string): Promise<ChatMessages>;
    fetchMessages(userId: number, chatHeadId: number, take: number, lastId?: number): Promise<Pagination>;
}
