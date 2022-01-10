import { GeneralEntity } from 'src/database/entity_inheritance/general';
import { ChatMessages } from './chat_messages.entity';
import { ChatParticipants } from './chat_participants.entity';
export declare class ChatHeads extends GeneralEntity {
    name: string | null;
    isOneToOne: boolean;
    chatParticipants: ChatParticipants[];
    chatMessages: ChatMessages[];
    chatParticipant?: ChatParticipants;
}
