import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SocketGateway } from './socket/socket.gateway';
import { DuoFinderService } from './duofinder/duo_finder.service';
import { UserBelongingsService } from 'src/app/modules/user/user_belongings.service';
import { MatchingLobbyService } from 'src/app/modules/user/matching_lobby.service';
import { MatchingSpamService } from 'src/app/modules/user/matching_spam.service';
import { JwtAcessService } from 'src/app/common/services/jwt_access.service';
import { UsersService } from './user/users.service';
import { NotificationsService } from './non_auth/notifications.service';
import { MatchedDuosService } from './user/matched_duos.service';
import { SocketService } from './socket/socket.service';
import { EntitiesModule } from './entities.module';
import { NetworkModule } from './network/network.module';

@Module({
    imports: [NetworkModule, EntitiesModule, JwtModule.register({ secret: process.env.JWT_SECRET })],
    providers: [
        SocketGateway,
        SocketService,
        UserBelongingsService,
        JwtAcessService,
        DuoFinderService,
        UsersService,
        MatchedDuosService,
        MatchingLobbyService,
        NotificationsService,
        MatchingSpamService,
    ],
    exports: [SocketGateway, SocketService],
})
export class SocketModule {}
