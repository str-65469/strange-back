import { Injectable } from '@nestjs/common';
import { ChatHeadRepository } from 'src/app/repositories/chat_head.repository';

@Injectable()
export class ChatHeadService {
  constructor(private readonly chatHeadRepository: ChatHeadRepository) {}

  createTableModel() {
    return this.chatHeadRepository.createTableModel({});
  }
}
