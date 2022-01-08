import { Injectable } from '@nestjs/common';
import { ChatParticipantsRepository } from 'src/app/repositories/chat_participant.repositry';
import { ChatParticipants } from 'src/database/entity/chat/chat_participants.entity';
import { In } from 'typeorm';

@Injectable()
export class ChatParticipantsService {
  constructor(private readonly chatParticipantsRepo: ChatParticipantsRepository) {}

  getChatParticipantsByUser(
    userId: number,
    partnerId: number,
    chatHeadId: number,
  ): Promise<ChatParticipants[]> {
    return this.chatParticipantsRepo.find({
      where: [
        {
          userId: userId,
          chatHeadId: chatHeadId,
        },
        {
          userId: partnerId,
          chatHeadId: chatHeadId,
        },
      ],
      relations: ['user'],
    });
  }

  getChatParticipants(userId: number, partnerId: number): Promise<ChatParticipants[]> {
    return this.chatParticipantsRepo.find({
      where: [
        {
          user: userId,
        },
        {
          user: partnerId,
        },
      ],
    });
  }

  createTableModel(userId: number, partnerId: number, chatHeadId: number) {
    return this.chatParticipantsRepo.createDoubleTableModel([
      {
        userId: userId,
        chatHeadId: chatHeadId,
      },
      {
        userId: partnerId,
        chatHeadId: chatHeadId,
      },
    ]);
  }

  getUserChatParticipants(userId: number) {
    return this.chatParticipantsRepo.find({
      where: {
        userId,
      },
    });
  }

  //   getPartnerParticipants(chatHeadIds: number[]) {
  //     return this.chatParticipantsRepo.find({
  //       where: {
  //         chatHeadId: In(chatHeadIds),
  //       },
  //     });
  //   }
}
