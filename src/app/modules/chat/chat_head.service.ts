import { Injectable } from '@nestjs/common';
import { ChatHeadRepository } from 'src/app/modules/entities/repositories/chat_head.repository';
import { In } from 'typeorm';

@Injectable()
export class ChatHeadService {
  constructor(private readonly chatHeadRepository: ChatHeadRepository) {}

  createTableModel() {
    return this.chatHeadRepository.createTableModel({});
  }

  getChatHeads(chatHeadIds: number[]) {
    return this.chatHeadRepository.find({
      where: {
        id: In(chatHeadIds),
      },
      relations: ['chatParticipants', 'chatParticipants.user'],
    });
  }
}
