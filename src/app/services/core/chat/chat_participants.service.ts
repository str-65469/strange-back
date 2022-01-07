import { Injectable } from '@nestjs/common';
import { ChatParticipantsRepository } from 'src/app/repositories/chat_participant.repositry';
import { ChatParticipants } from 'src/database/entity/chat/chat_participants.entity';

@Injectable()
export class ChatParticipantsService {
  constructor(private readonly chatParticipantsRepo: ChatParticipantsRepository) {}

  getChatParticipants(userId: number, partnerId: number, chatHeadId: number): Promise<ChatParticipants[]> {
    return this.chatParticipantsRepo.find({
      where: [
        {
          user: userId,
          chatHead: chatHeadId,
        },
        {
          user: partnerId,
          chatHead: chatHeadId,
        },
      ],
      relations: ['user'],
    });
  }
}
