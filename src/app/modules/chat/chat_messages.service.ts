import { Injectable } from '@nestjs/common';
import { MessageType } from 'src/app/common/enum/message_type.enum';
import { Pagination } from 'src/app/schemas/pagination';
import { ChatMessagesRepository } from 'src/app/repositories/chat_messages.repository';
import { ChatMessages } from 'src/database/entity/chat/chat_messages.entity';
import { FindConditions, In, LessThan } from 'typeorm';
import { ChatParticipants } from 'src/database/entity/chat/chat_participants.entity';

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

    getLastChatMessages(chatParticipants: ChatParticipants[], userId: number) {
        const chatHeadIds = chatParticipants.map((el) => el.chatHeadId);

        // select distinct on ("userId", "chatHeadId") * from chat_messages
        // where "userId" != 1 order by "userId","chatHeadId",id desc;

        const query = this.chatMessagesRepo
            .createQueryBuilder('ch')
            .distinctOn(['ch.userId', 'ch.chatHeadId'])
            .where('ch.chatHeadId in (:...chatHeadIds)', { chatHeadIds })
            .andWhere('ch.userId != :userId', { userId })
            .orderBy('ch.userId, ch.chatHeadId, ch.id', 'DESC');

        // console.log(query.getQueryAndParameters());

        return query.getMany();
    }
}
