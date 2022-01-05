import User from '../user.entity';
import { MessageType } from 'src/app/common/enum/message_type.enum';
import { GeneralEntity } from 'src/database/entity_inheritance/general';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ChatHeads } from './chat_heads.entity';

@Entity('chat_messages')
export class ChatMessages extends GeneralEntity {
  @Column({ name: 'text_message', type: 'text' }) textMessage: string | null;
  @Column({ name: 'img_url' }) imgUrl: string | null;
  @Column({ name: 'voice_url' }) voiceUrl: string | null;
  @Column({ name: 'video_url' }) videoUrl: string | null;
  @Column({ name: 'gif_url' }) gifURl: string | null;
  @Column({ name: 'message_type', nullable: false, enum: MessageType, type: 'enum' }) messageType: MessageType;
  @Column({ name: 'is_deleted', nullable: false, default: false }) isDeleted: boolean;

  @ManyToOne(() => User, (user) => user.chatMessages) user: User;

  @ManyToOne(() => ChatHeads, (chatHead) => chatHead.chatMessages)
  @JoinColumn({ name: 'chatHeadId' })
  chatHead: ChatHeads;
}
