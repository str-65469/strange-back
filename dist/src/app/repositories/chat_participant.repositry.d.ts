import { ChatParticipants } from 'src/database/entity/chat/chat_participants.entity';
import { DeepPartial, Repository } from 'typeorm';
export declare class ChatParticipantsRepository extends Repository<ChatParticipants> {
    createDoubleTableModel(chatParticipantsArray: DeepPartial<ChatParticipants[]>): ChatParticipants[];
}
