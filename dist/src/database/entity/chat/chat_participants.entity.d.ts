import User from '../user.entity';
import { GeneralEntity } from 'src/database/entity_inheritance/general';
import { ChatHeads } from './chat_heads.entity';
export declare class ChatParticipants extends GeneralEntity {
    chatLastDeletedAt: Date | null;
    userId: number;
    chatHeadId: number;
    user: User;
    chatHead: ChatHeads;
}
