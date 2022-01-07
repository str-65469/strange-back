import User from '../user.entity';
import { GeneralEntity } from 'src/database/entity_inheritance/general';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ChatHeads } from './chat_heads.entity';

@Entity('chat_participants')
export class ChatParticipants extends GeneralEntity {
  @Column({ type: 'timestamptz', name: 'chat_last_deleted_at' }) chatLastDeletedAt: Date | null;

  @Column({ type: 'unsigned big int', nullable: true }) userId: number;
  @Column({ type: 'unsigned big int', nullable: true }) chatHeadId: number;

  @ManyToOne(() => User, (user) => user.chatParticipants) user: User;
  @ManyToOne(() => ChatHeads, (chatHead) => chatHead.chatParticipants) chatHead: ChatHeads;
}
