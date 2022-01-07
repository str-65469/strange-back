import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchedDuos } from 'src/database/entity/matched_duos.entity';
import { MatchedDuosNotifications } from 'src/database/entity/matched_duos_notifications.entity';
import { MatchingLobby } from 'src/database/entity/matching_lobby.entity';
import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { ChatController } from '../controllers/chat.controller';
import { ChatHeadRepository } from '../repositories/chat_head.repository';
import { ChatMessagesRepository } from '../repositories/chat_messages.repository';
import { ChatParticipantsRepository } from '../repositories/chat_participant.repositry';
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
import { UsersModule } from './users.module';

@Module({
  imports: [
    UsersModule,

    // SocketModule,
    TypeOrmModule.forFeature([
      ChatParticipantsRepository,
      ChatMessagesRepository,
      ChatHeadRepository,

      // must be replace in future !
      MatchedDuos,
      MatchingLobby,
      MatchingSpams,
      MatchedDuosNotifications,
    ]),
  ],
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
