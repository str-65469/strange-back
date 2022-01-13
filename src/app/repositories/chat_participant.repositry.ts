import { ChatParticipants } from 'src/database/entity/chat/chat_participants.entity';
import { DeepPartial, EntityRepository, Repository } from 'typeorm';

@EntityRepository(ChatParticipants)
export class ChatParticipantsRepository extends Repository<ChatParticipants> {
    createDoubleTableModel(chatParticipantsArray: DeepPartial<ChatParticipants[]>): ChatParticipants[] {
        return this.create(chatParticipantsArray);
    }
}
