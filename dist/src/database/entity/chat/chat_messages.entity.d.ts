import User from '../user.entity';
import { MessageType } from 'src/app/common/enum/message_type.enum';
import { GeneralEntity } from 'src/database/entity_inheritance/general';
import { ChatHeads } from './chat_heads.entity';
export declare class ChatMessages extends GeneralEntity {
    textMessage: string | null;
    imgUrl: string | null;
    voiceUrl: string | null;
    videoUrl: string | null;
    gifURl: string | null;
    messageType: MessageType;
    isDeleted: boolean;
    userId: number;
    chatHeadId: number;
    user: User;
    chatHead: ChatHeads;
}
