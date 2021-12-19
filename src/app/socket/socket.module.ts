import User from 'src/database/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { SocketGateway } from './socket.gateway';
import { DuoFinderService } from '../services/core/duo_finder.service';
import { MatchedDuos } from 'src/database/entity/matched_duos.entity';
import { MatchingLobby } from 'src/database/entity/matching_lobby.entity';
import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { UserDetails } from 'src/database/entity/user_details.entity';
import { MatchedDuosNotifications } from 'src/database/entity/matched_duos_notifications.entity';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { UserBelongingsService } from 'src/app/services/core/user/user_belongings.service';
import { UserBelongings } from 'src/database/entity/user_belongings.entity';
import { MatchingLobbyService } from 'src/app/services/core/matcheds/matching_lobby.service';
import { MatchingSpamService } from 'src/app/services/core/matcheds/matching_spam.service';
import { JwtAcessService } from 'src/app/services/common/jwt_access.service';
import { UsersService } from '../services/core/user/users.service';
import { NotificationsService } from '../services/core/notifications.service';
import { MatchedDuosService } from '../services/core/matcheds/matched_duos.service';

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
      UserBelongings,
    ]),
  ],
  providers: [
    UserBelongingsService,
    JwtAcessService,
    SocketGateway,
    DuoFinderService,
    UsersService,
    MatchedDuosService,
    MatchingLobbyService,
    NotificationsService,
    MatchingSpamService,
  ],
})
export class SocketModule {}
