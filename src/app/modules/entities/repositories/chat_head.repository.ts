import { ChatHeads } from 'src/database/entity/chat/chat_heads.entity';
import { DeepPartial, EntityRepository, Repository } from 'typeorm';

@EntityRepository(ChatHeads)
export class ChatHeadRepository extends Repository<ChatHeads> {
  createTableModel(chatHead: DeepPartial<ChatHeads>) {
    return this.create(chatHead);
  }
}
