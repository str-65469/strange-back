import { Module } from '@nestjs/common';
import { ChatController } from '../controllers/chat.controller';
import { ChatService } from '../services/core/chat.service';
import { ChatHeadService } from '../services/core/chat/chat_head.service';
import { ChatMessagesService } from '../services/core/chat/chat_messages.service';
import { ChatParticipantsService } from '../services/core/chat/chat_participants.service';
import { DuoFinderService } from '../services/core/duo_finder.service';
import { MatchedDuosService } from '../services/core/matcheds/matched_duos.service';
import { MatchingLobbyService } from '../services/core/matcheds/matching_lobby.service';
import { MatchingSpamService } from '../services/core/matcheds/matching_spam.service';
import { NotificationsService } from '../services/core/notifications.service';
import { SocketService } from '../services/core/socket.service';
import { UserBelongingsService } from '../services/core/user/user_belongings.service';
import { SocketGateway } from '../socket/socket.gateway';
import { EntitiesModule } from './entities.module';
import { UsersModule } from './users.module';

@Module({
  imports: [UsersModule, EntitiesModule],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatParticipantsService,
    ChatMessagesService,
    ChatHeadService,

    // must be replace in future !
    SocketService,
    SocketGateway,
    DuoFinderService,
    MatchedDuosService,
    MatchingLobbyService,
    NotificationsService,
    MatchingSpamService,
    UserBelongingsService,
  ],
  exports: [],
})
export class ChatModule {}
