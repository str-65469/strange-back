import { Injectable } from '@nestjs/common';
import { ChatParticipantsRepository } from 'src/app/repositories/chat_participant.repositry';
import { TypeormReturnedFromRaw } from 'src/app/utils/typeorm.helper';
import { ChatParticipants } from 'src/database/entity/chat/chat_participants.entity';

@Injectable()
export class ChatParticipantsService {
    constructor(private readonly chatParticipantsRepo: ChatParticipantsRepository) {}

    getChatParticipantsByUser(userId: number, partnerId: number, chatHeadId: number): Promise<ChatParticipants[]> {
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

    async updateLastSeenByParticipantId(chatParticipantId: number, messageDate: Date) {
        const chatParticipant = this.chatParticipantsRepo
            .createQueryBuilder()
            .update()
            .set({ chatLastSeenAt: messageDate })
            .where('id = :id', { id: chatParticipantId })
            .returning('*')
            .execute();

        return TypeormReturnedFromRaw<ChatParticipants>(chatParticipant);
    }

    updateLastSeenByChatHeadAndUserId(userId: number, chatHeadId: number, date: Date) {
        const chatParticipant = this.chatParticipantsRepo
            .createQueryBuilder()
            .update()
            .set({ chatLastSeenAt: date })
            .where('userId = :userId and chatHeadId = :chatHeadId', { userId, chatHeadId })
            .returning('*')
            .execute();

        return TypeormReturnedFromRaw<ChatParticipants>(chatParticipant);
    }
}
