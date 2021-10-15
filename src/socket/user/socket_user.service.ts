import { MatchedDuos } from './../../database/entity/matched_duos.entity';
import { MatchingSpams } from './../../database/entity/matching_spams.entity';
import { getManager, Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { AccessTokenPayload, JwtAcessService } from 'src/http/jwt/jwt-access.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/database/entity/user.entity';
import * as cookie from 'cookie';
import { UserCombined } from '../duofinder/duo_finder.service';
import { MatchingLobby } from 'src/database/entity/matching_lobby.entity';

@Injectable()
export class SocketUserService {
  constructor(
    private readonly jwtAccessService: JwtAcessService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(MatchedDuos) private readonly matchedRepo: Repository<MatchedDuos>,
    @InjectRepository(MatchingLobby) private readonly lobbyRepo: Repository<MatchingLobby>,
    @InjectRepository(MatchingSpams) private readonly spamRepo: Repository<MatchingSpams>,
  ) {}

  getUserPayload(socket: Socket): AccessTokenPayload {
    const headerCookies = socket.handshake.headers.cookie;
    const cookies = cookie.parse(headerCookies);
    const token = cookies?.access_token;
    this.jwtAccessService.validateToken({ token, secret: process.env.JWT_SECRET });

    const accessTokenDecoded = this.jwtService.decode(token) as AccessTokenPayload;

    return accessTokenDecoded;
  }

  public async findWithFilters(id: number) {
    return await getManager()
      .createQueryBuilder('users', 'u')
      .leftJoin('matching_spams', 'ms', 'ms.user_id = u.id') // use filters (spams)
      .leftJoinAndSelect('u.userDetails', 'user_details') // user details
      .select('*')
      .where('u.id = :id', { id })
      .getRawOne();
  }

  public async findMatchedUsers(id) {
    return await this.matchedRepo.find({
      where: { user_id: id },
    });
  }

  public async checkIfCurrentUserLiked(id) {
    return await this.lobbyRepo.find({
      where: { liked_user_id: id },
    });
  }

  public async saveUserIntoMatched(matchings: Array<MatchingLobby>) {
    return await this.matchedRepo.save(matchings);
  }

  public async updateUserSpamFilter(id: number, ids: number[]) {
    return await this.spamRepo.save({
      id,
      matched_list: ids,
    });
  }

  // main method for finding match
  public async findDuo(userDetaled: UserCombined) {
    return 123;
    // .where("id IN(:...ids)", { ids: [1,2,3] })

    // return getManager()
    // .createQueryBuilder('user_details', 'ud')
    // .where('ud.user')

    // return await getManager()
    //   .createQueryBuilder('users', 'u')
    //   .leftJoin('matching_spams', 'ms', 'ms.user_id = u.id') // use filters (spams)
    //   .leftJoinAndSelect('u.userDetails', 'user_details') // user details
    //   .select('*')
    //   .where('u.id = :id', { id })
    //   .getRawOne();
  }
}
