import { ChatMessages } from 'src/database/entity/chat/chat_messages.entity';
import { DeepPartial, EntityRepository, Repository } from 'typeorm';

@EntityRepository(ChatMessages)
export class ChatMessagesRepository extends Repository<ChatMessages> {
  createModel(chatMessage: DeepPartial<ChatMessages>) {
    return this.create(chatMessage);
  }
}
