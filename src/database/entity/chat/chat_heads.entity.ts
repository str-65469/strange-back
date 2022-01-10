import { GeneralEntity } from 'src/database/entity_inheritance/general';
import { Column, Entity, OneToMany } from 'typeorm';
import { ChatMessages } from './chat_messages.entity';
import { ChatParticipants } from './chat_participants.entity';

@Entity('chat_heads')
export class ChatHeads extends GeneralEntity {
  @Column({ name: 'name', nullable: true })
  name: string | null;

  @Column({ name: 'is_one_to_one', nullable: false, default: true })
  isOneToOne: boolean;

  @OneToMany(() => ChatParticipants, (chatParticipants) => chatParticipants.chatHead)
  chatParticipants: ChatParticipants[];

  @OneToMany(() => ChatMessages, (chatMessages) => chatMessages.chatHead)
  chatMessages: ChatMessages[];

  // must be removed after mapping
  chatParticipant?: ChatParticipants;
}
