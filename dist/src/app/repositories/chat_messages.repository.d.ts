import { ChatMessages } from 'src/database/entity/chat/chat_messages.entity';
import { DeepPartial, Repository } from 'typeorm';
export declare class ChatMessagesRepository extends Repository<ChatMessages> {
    createModel(chatMessage: DeepPartial<ChatMessages>): ChatMessages;
}
