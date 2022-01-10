import { ChatHeads } from 'src/database/entity/chat/chat_heads.entity';
import { DeepPartial, Repository } from 'typeorm';
export declare class ChatHeadRepository extends Repository<ChatHeads> {
    createTableModel(chatHead: DeepPartial<ChatHeads>): ChatHeads;
}
