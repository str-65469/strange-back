import { Injectable } from '@nestjs/common';
import { MessageType } from 'src/app/common/enum/message_type.enum';
import { Pagination } from 'src/app/schemas/pagination';
import { ChatMessagesRepository } from 'src/app/modules/entities/repositories/chat_messages.repository';
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
    let chatWhere: FindConditions<ChatMessages> = {
      chatHeadId,
    };

    let countWhere: FindConditions<ChatMessages> = {
      chatHeadId,
    };

    if (lastId) {
      chatWhere = { ...chatWhere, id: LessThan(lastId) };
    }

    const data = await this.chatMessagesRepo.find({
      where: chatWhere,
      take,
      order: { id: 'DESC' },
    });

    const count = await this.chatMessagesRepo.count({
      where: countWhere,
    });

    return {
      data,
      count,
    };
  }
}
