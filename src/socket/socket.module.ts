import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketUserService } from './user/socket_user.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAcessService } from 'src/http/jwt/jwt-access.service';
import { DuoMatchGateway } from './duofinder/duofinder.gateway';
import { DuoFinderService } from './duofinder/duo_finder.service';
import User from 'src/database/entity/user.entity';
import { MatchedDuos } from 'src/database/entity/matched_duos.entity';
import { MatchingLobby } from 'src/database/entity/matching_lobby.entity';
import { MatchingSpams } from 'src/database/entity/matching_spams.entity';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    TypeOrmModule.forFeature([User, MatchedDuos, MatchingLobby, MatchingSpams]),
  ],
  controllers: [],
  providers: [JwtAcessService, DuoMatchGateway, DuoFinderService, SocketUserService],
})
export class SocketModule {}
