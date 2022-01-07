import User from '../user.entity';
import { MessageType } from 'src/app/common/enum/message_type.enum';
import { GeneralEntity } from 'src/database/entity_inheritance/general';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ChatHeads } from './chat_heads.entity';

@Entity('chat_messages')
export class ChatMessages extends GeneralEntity {
  @Column({ name: 'text_message', type: 'text' }) textMessage: string;
  @Column({ name: 'img_url' }) imgUrl: string;
  @Column({ name: 'voice_url' }) voiceUrl: string;
  @Column({ name: 'video_url' }) videoUrl: string;
  @Column({ name: 'gif_url' }) gifURl: string;
  @Column({ name: 'message_type', nullable: false, enum: MessageType, type: 'enum' }) messageType: MessageType;
  @Column({ name: 'is_deleted', nullable: false, default: false }) isDeleted: boolean;

  @Column({ type: 'unsigned big int', nullable: true }) userId: number;
  @Column({ type: 'unsigned big int', nullable: true }) chatHeadId: number;

  @ManyToOne(() => User, (user) => user.chatMessages) user: User;
  @ManyToOne(() => ChatHeads, (chatHead) => chatHead.chatMessages) chatHead: ChatHeads;
}
