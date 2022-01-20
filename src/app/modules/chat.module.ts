import { Module } from '@nestjs/common';
import { ChatController } from '../controllers/chat.controller';
import { ChatService } from './chat/chat.service';
import { ChatHeadService } from './chat/chat_head.service';
import { ChatMessagesService } from './chat/chat_messages.service';
import { ChatParticipantsService } from './chat/chat_participants.service';
import { DuoFinderService } from './duofinder/duo_finder.service';
import { MatchedDuosService } from './user/matched_duos.service';
import { MatchingLobbyService } from './user/matching_lobby.service';
import { MatchingSpamService } from './user/matching_spam.service';
import { NotificationsService } from './non_auth/notifications.service';
import { SocketService } from './socket/socket.service';
import { UserBelongingsService } from './user/user_belongings.service';
import { SocketGateway } from './socket/socket.gateway';
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
