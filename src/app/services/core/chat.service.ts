import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionMessageCode } from 'src/app/common/enum/message_codes/exception_message_code.enum';
import { GenericException } from 'src/app/common/exceptions/general.exception';
import { ChatMessagesService } from './chat/chat_messages.service';
import { ChatParticipantsService } from './chat/chat_participants.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatParticipantsService: ChatParticipantsService,
    private readonly chatMessagesService: ChatMessagesService,
  ) {}

  async userBelongsToChatHead(userId: number, partnerId: number, chatHeadId: number) {
    const participants = await this.chatParticipantsService.getChatParticipants(userId, partnerId, chatHeadId);

    const user = participants.find(
      (participant) => participant.chatHeadId === chatHeadId && participant.userId === userId,
    );

    const partner = participants.find(
      (participant) => participant.chatHeadId === chatHeadId && participant.userId === partnerId,
    );

    if (!user) {
      throw new GenericException(HttpStatus.BAD_REQUEST, ExceptionMessageCode.USER_DOESNT_BELONG_TO_CHATHEAD);
    }

    return {
      user,
      partner,
    };
  }

  async insertMessage(userId: number, chatHeadId: number, message: string) {
    return this.chatMessagesService.insertMessage(userId, chatHeadId, message);
  }
}
