import User from '../user.entity';
import { MessageType } from 'src/app/common/enum/message_type.enum';
import { GeneralEntity } from 'src/database/entity_inheritance/general';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ChatHeads } from './chat_heads.entity';

@Entity('chat_messages')
export class ChatMessages extends GeneralEntity {
    @Column({ name: 'text_message', nullable: true, type: 'text' })
    textMessage: string | null;

    @Column({ name: 'img_url', nullable: true })
    imgUrl: string | null;

    @Column({ name: 'voice_url', nullable: true })
    voiceUrl: string | null;

    @Column({ name: 'video_url', nullable: true })
    videoUrl: string | null;

    @Column({ name: 'gif_url', nullable: true })
    gifURl: string | null;

    @Column({
        enum: MessageType,
        type: 'enum',
        nullable: false,
    })
    messageType: MessageType;

    @Column({ name: 'is_deleted', nullable: false, default: false })
    isDeleted: boolean;

    @Column({ type: 'unsigned big int', nullable: true }) userId: number;
    @Column({ type: 'unsigned big int', nullable: true }) chatHeadId: number;
    @ManyToOne(() => User, (user) => user.chatMessages) user: User;
    @ManyToOne(() => ChatHeads, (chatHead) => chatHead.chatMessages) chatHead: ChatHeads;
}
