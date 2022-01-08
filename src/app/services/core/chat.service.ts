import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionMessageCode } from 'src/app/common/enum/message_codes/exception_message_code.enum';
import { GenericException } from 'src/app/common/exceptions/general.exception';
import { Connection } from 'typeorm';
import { ChatHeadService } from './chat/chat_head.service';
import { ChatMessagesService } from './chat/chat_messages.service';
import { ChatParticipantsService } from './chat/chat_participants.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatParticipantsService: ChatParticipantsService,
    private readonly chatMessagesService: ChatMessagesService,
    private readonly chatHeadService: ChatHeadService,
    private readonly connection: Connection,
  ) {}

  async userBelongsToChatHead(userId: number, partnerId: number, chatHeadId: number) {
    const participants = await this.chatParticipantsService.getChatParticipantsByUser(
      userId,
      partnerId,
      chatHeadId,
    );

    const user = participants.find(
      (participant) => participant.chatHeadId === chatHeadId && participant.userId === userId,
    );

    const partner = participants.find(
      (participant) => participant.chatHeadId === chatHeadId && participant.userId === partnerId,
    );

    if (!user) {
      throw new GenericException(
        HttpStatus.BAD_REQUEST,
        ExceptionMessageCode.USER_DOESNT_BELONG_TO_CHATHEAD,
      );
    }

    if (!partner) {
      throw new GenericException(
        HttpStatus.BAD_REQUEST,
        ExceptionMessageCode.USER_CHATHEAD_PARTNER_NOT_FOUND,
      );
    }

    return {
      user,
      partner,
    };
  }

  async insertMessage(userId: number, chatHeadId: number, message: string) {
    return this.chatMessagesService.insertMessage(userId, chatHeadId, message);
  }

  async createChatTables(userId: number, partnerId: number): Promise<void> {
    return this.connection.transaction(async (manager) => {
      // first check if chat participants already exists or not
      const participants = await this.chatParticipantsService.getChatParticipants(userId, partnerId);

      // participants and chathead already exists
      if (participants.length > 0) {
        return;
      }

      // then create chat head
      const chatHeadTableModel = this.chatHeadService.createTableModel();
      const chatHeadTable = await manager.save(chatHeadTableModel);

      // then create chat participants
      const chatParticipantsTableModel = this.chatParticipantsService.createTableModel(
        userId,
        partnerId,
        chatHeadTable.id,
      );
      await manager.save(chatParticipantsTableModel);
    });
  }

  async getChatheads(userId: number) {
    // first fetch user chat participation columns
    const userChatParticipants = await this.chatParticipantsService.getUserChatParticipants(userId);

    const chatHeadIds = userChatParticipants.map((el) => el.chatHeadId);

    // then fetch all participant columns based on chat head ids
    const chatHeads = await this.chatHeadService.getChatHeads(chatHeadIds);
    // const userPartnerParticipants = await this.chatParticipantsService.getPartnerParticipants(chatHeadIds);

    return chatHeads;
  }

  getMessages(userId: number, chatHeadId: number, take: number, lastId?: number) {
    const takeCount = take || 10;

    return this.chatMessagesService.fetchMessages(userId, chatHeadId, takeCount, lastId);
  }
}
