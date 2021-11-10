import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DuoMatchGateway } from './duofinder.gateway';
import { DuoFinderService } from './services/duo_finder.service';
import { MatchedDuos } from 'src/database/entity/matched_duos.entity';
import { MatchingLobby } from 'src/database/entity/matching_lobby.entity';
import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { UserDetails } from 'src/database/entity/user_details.entity';
import { MatchedDuosNotifications } from 'src/database/entity/matched_duos_notifications.entity';
import { UsersService } from 'src/modules/user/services/users.service';
import User from 'src/database/entity/user.entity';
import { MatchedDuosService } from 'src/app/core/matched_duos/matchedduos.service';
import { MatchingLobbyService } from 'src/app/core/matching_lobby/matchinglobby.service';
import { MatchingSpamService } from 'src/app/core/matching_spam/matchingspamservice.service';
import { NotificationsService } from 'src/app/core/notifications/notifications.service';
import { JwtAcessService } from 'src/app/jwt/jwt-access.service';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    HttpModule.register({ baseURL: process.env.CHECKED_SERVER_URL, timeout: 10000 }), // 10 sec
    TypeOrmModule.forFeature([
      MatchedDuos,
      MatchingLobby,
      MatchingSpams,
      User,
      UserDetails,
      MatchedDuosNotifications,
      UserRegisterCache,
    ]),
  ],
  controllers: [],
  providers: [
    JwtAcessService,
    DuoMatchGateway,
    DuoFinderService,
    UsersService,
    MatchedDuosService,
    MatchingLobbyService,
    NotificationsService,
    MatchingSpamService,
  ],
})
export class SocketModule {}