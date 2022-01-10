import { ChatParticipantsRepository } from 'src/app/repositories/chat_participant.repositry';
import { ChatParticipants } from 'src/database/entity/chat/chat_participants.entity';
export declare class ChatParticipantsService {
    private readonly chatParticipantsRepo;
    constructor(chatParticipantsRepo: ChatParticipantsRepository);
    getChatParticipantsByUser(userId: number, partnerId: number, chatHeadId: number): Promise<ChatParticipants[]>;
    getChatParticipants(userId: number, partnerId: number): Promise<ChatParticipants[]>;
    createTableModel(userId: number, partnerId: number, chatHeadId: number): ChatParticipants[];
    getUserChatParticipants(userId: number): Promise<ChatParticipants[]>;
}
