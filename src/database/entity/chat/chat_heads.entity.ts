import { GeneralEntity } from 'src/database/entity_inheritance/general';
import { Column, Entity, OneToMany } from 'typeorm';
import { ChatMessages } from './chat_messages.entity';
import { ChatParticipants } from './chat_participants.entity';

@Entity('chat_heads')
export class ChatHeads extends GeneralEntity {
  @Column({ name: 'name', nullable: false }) name: string;
  @Column({ name: 'is_one_to_one', nullable: false, default: true }) isOneToOne: boolean;

  @OneToMany(() => ChatParticipants, (chatParticipants) => chatParticipants.chatHead)
  chatParticipants: ChatParticipants[];

  @OneToMany(() => ChatMessages, (chatMessages) => chatMessages.chatHead)
  chatMessages: ChatMessages[];
}
