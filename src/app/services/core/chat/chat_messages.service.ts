import { Injectable } from '@nestjs/common';
import { MessageType } from 'src/app/common/enum/message_type.enum';
import { ChatMessagesRepository } from 'src/app/repositories/chat_messages.repository';
import { ChatMessages } from 'src/database/entity/chat/chat_messages.entity';

@Injectable()
export class ChatMessagesService {
  constructor(private readonly chatMessagesRepo: ChatMessagesRepository) {}

  insertMessage(userId: number, chatHeadId: number, message: string): Promise<ChatMessages> {
    const chatMessage = this.chatMessagesRepo.createModel({
      userId: userId,
      chatHeadId: chatHeadId,
      textMessage: message,
      messageType: MessageType.TEXT,
    });

    return this.chatMessagesRepo.save(chatMessage);
  }
}
