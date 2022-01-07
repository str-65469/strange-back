import { ChatParticipants } from 'src/database/entity/chat/chat_participants.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ChatParticipants)
export class ChatParticipantsRepository extends Repository<ChatParticipants> {}
