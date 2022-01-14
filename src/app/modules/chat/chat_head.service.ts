import { Injectable } from '@nestjs/common';
import { ChatHeadRepository } from 'src/app/repositories/chat_head.repository';
import { ChatMessages } from 'src/database/entity/chat/chat_messages.entity';
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

        // return this.chatHeadRepository
        //     .createQueryBuilder('chatHead')
        //     .innerJoinAndSelect('chatHead.chatParticipants', 'chatParticipants')
        //     .innerJoinAndSelect('chatHead.chatMessages', 'chatMessages')
        //     .innerJoinAndSelect('chatParticipants.user', 'user')
        //     .where('chatHead.id IN (:...chatHeadIds)', { chatHeadIds })
        //     .getMany();
    }
}
