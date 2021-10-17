import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketUserService } from './user/socket_user.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAcessService } from 'src/http/jwt/jwt-access.service';
import { DuoMatchGateway } from './duofinder/duofinder.gateway';
import { DuoFinderService } from './duofinder/duo_finder.service';
import { MatchedDuos } from 'src/database/entity/matched_duos.entity';
import { MatchingLobby } from 'src/database/entity/matching_lobby.entity';
import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import User from 'src/database/entity/user.entity';
import UserDetails from 'src/database/entity/user_details.entity';
import { MatchedDuosNotifications } from 'src/database/entity/matched_duos_notifications.entity';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    TypeOrmModule.forFeature([
      MatchedDuos,
      MatchingLobby,
      MatchingSpams,
      User,
      UserDetails,
      MatchedDuosNotifications,
    ]),
  ],
  controllers: [],
  providers: [JwtAcessService, DuoMatchGateway, DuoFinderService, SocketUserService],
})
export class SocketModule {}
