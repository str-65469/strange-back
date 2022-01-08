import { Injectable } from '@nestjs/common';
import { MessageType } from 'src/app/common/enum/message_type.enum';
import { Pagination } from 'src/app/common/schemas/pagination';
import { ChatMessagesRepository } from 'src/app/repositories/chat_messages.repository';
import { ChatMessages } from 'src/database/entity/chat/chat_messages.entity';
import { FindConditions, LessThan } from 'typeorm';

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

  async fetchMessages(
    userId: number,
    chatHeadId: number,
    take: number,
    lastId?: number,
  ): Promise<Pagination> {
    let where: FindConditions<ChatMessages> = {
      userId,
      chatHeadId,
    };

    if (lastId) {
      where = { id: LessThan(lastId), ...where };
    }

    const [result, total] = await this.chatMessagesRepo.findAndCount({
      where,
      take,
      order: { id: 'DESC' },
    });

    return {
      data: result,
      count: total,
    };
  }
}
