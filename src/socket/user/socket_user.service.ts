import { LolLeague } from 'src/enum/lol_league.enum';
import { MatchedDuos } from './../../database/entity/matched_duos.entity';
import { MatchingSpams } from './../../database/entity/matching_spams.entity';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { AccessTokenPayload, JwtAcessService } from 'src/http/jwt/jwt-access.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCombined } from '../duofinder/duo_finder.service';
import { MatchingLobby } from 'src/database/entity/matching_lobby.entity';
import { HandleDuoFindBody } from '../duofinder/responses';
import User from 'src/database/entity/user.entity';
import UserDetails from 'src/database/entity/user_details.entity';
import * as cookie from 'cookie';

@Injectable()
export class SocketUserService {
  constructor(
    private readonly jwtAccessService: JwtAcessService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserDetails) private readonly userDetailsRepo: Repository<UserDetails>,
    @InjectRepository(MatchedDuos) private readonly matchedRepo: Repository<MatchedDuos>,
    @InjectRepository(MatchingLobby) private readonly lobbyRepo: Repository<MatchingLobby>,
    @InjectRepository(MatchingSpams) private readonly spamRepo: Repository<MatchingSpams>,
  ) {}

  public getUserPayload(socket: Socket): AccessTokenPayload {
    const headerCookies = socket.handshake.headers.cookie;
    const cookies = cookie.parse(headerCookies);
    const token = cookies?.access_token;
    this.jwtAccessService.validateToken({ token, secret: process.env.JWT_SECRET });

    const accessTokenDecoded = this.jwtService.decode(token) as AccessTokenPayload;

    return accessTokenDecoded;
  }

  public async findMatchedUsers(id: number) {
    const matchedUsers = await this.matchedRepo.find({
      where: { user_id: id },
    });

    const ids = matchedUsers.map((e) => e.id);

    if (ids.length) {
      // get user and user details
      const matchedUsers = await this.userRepo
        .createQueryBuilder('u')
        .leftJoinAndSelect('user_details', 'us', 'us.user_id = u.id') // use filters (spams)
        .where('u.id IN (:...ids)', { ids })
        .select(
          'u.id, u.username, u.img_path, u.email, us.discord_name, us.league, us.league_points, us.level, us.main_champions, us.main_lane, us.server, us.summoner_name',
        )
        .getRawMany();

      return matchedUsers;
    }

    return [];
  }

  public async findNewDuoDetails(userDetaled: UserCombined) {
    const { accept_list, remove_list, decline_list, matched_list } = userDetaled;

    const al = accept_list ?? [];
    const rl = remove_list ?? [];
    const dl = decline_list ?? [];
    const ml = matched_list ?? [];

    // filter plus current
    const filterList = [...new Set([...al, ...rl, ...dl, ...ml, userDetaled.id])];

    // league filtering
    const leagues = Object.values(LolLeague);
    const currEnumIndex = leagues.indexOf(userDetaled.league);
    let filteredLeagues = [];
    if (currEnumIndex === 0) {
      filteredLeagues = leagues.filter((_, i) => i <= currEnumIndex + 1);
    } else if (currEnumIndex === leagues.length - 1) {
      filteredLeagues = leagues.filter((_, i) => i >= currEnumIndex - 1);
    } else {
      filteredLeagues = leagues.filter((_, i) => i >= currEnumIndex - 1 && i <= currEnumIndex + 1);
    }

    return await this.userDetailsRepo
      .createQueryBuilder('ud')
      .where('user_id NOT IN (:...ids)', { ids: filterList })
      .andWhere('server = :server', { server: userDetaled.server })
      .andWhere('league IN (:...leagues)', { leagues: filteredLeagues })
      .limit(1)
      .select(
        'ud.id, ud.discord_name, ud.league, ud.league_points, ud.level, ud.main_champions, ud.main_lane, ud.server, ud.summoner_name',
      )
      .getRawOne();
  }

  async findNewDuoDetailsFiltered(userDetaled: UserCombined, data: HandleDuoFindBody) {
    const { accept_list, remove_list, decline_list, matched_list } = userDetaled;

    const al = accept_list ?? [];
    const rl = remove_list ?? [];
    const dl = decline_list ?? [];
    const ml = matched_list ?? [];

    // filter plus current
    const filterList = [...new Set([...al, ...rl, ...dl, ...ml, userDetaled.id])];
    const leagues = Object.values(LolLeague);
    const currEnumIndex = leagues.indexOf(userDetaled.league);

    let filteredLeagues = [];

    if (currEnumIndex === 0) {
      filteredLeagues = leagues.filter((el, i) => i <= currEnumIndex + 1);
    } else if (currEnumIndex === leagues.length - 1) {
      filteredLeagues = leagues.filter((el, i) => i >= currEnumIndex - 1);
    } else {
      filteredLeagues = leagues.filter((el, i) => i >= currEnumIndex - 1 && i <= currEnumIndex + 1);
    }

    return await this.userDetailsRepo
      .createQueryBuilder('ud')
      .where('user_id NOT IN (:...ids)', { ids: filterList })
      .andWhere('server = :server', { server: userDetaled.server })
      .andWhere('league IN (:...leagues)', { leagues: filteredLeagues })
      .andWhere('user_id > :id', { id: data.prevFound.id }) //! critical (oponnent id is more than prevous oponent)
      .limit(1)
      .select(
        'ud.id, ud.discord_name, ud.league, ud.league_points, ud.level, ud.main_champions, ud.main_lane, ud.server, ud.summoner_name',
      )
      .getRawOne();
  }

  async getUserDuoDetails(user_id: number) {
    return await this.userDetailsRepo
      .createQueryBuilder()
      .andWhere('user_id = :user_id', { user_id })
      .select(
        'id, discord_name, league, league_points, level, main_champions, main_lane, server, summoner_name',
      )
      .getRawOne();
  }

  public async findDuo(id: number) {
    const duo = await this.userRepo
      .createQueryBuilder()
      .where('id = :id', { id })
      .select('email, id, img_path, username', 'socket_id')
      .getRawOne();

    const temp = JSON.parse(JSON.stringify(duo));
    temp.full_image_path = duo.img_path ?? null;
    // temp.full_image_path = duo.img_path ? process.env.APP_URL + '/upload' + duo.img_path : null;

    return temp;
  }

  public async findIfUserIsWaiting(user_id: number, matched_user_id: number) {
    return await this.lobbyRepo
      .createQueryBuilder()
      .where('user_id = :user_id AND matched_user_id = :matched_user_id', { user_id, matched_user_id })
      .getRawOne();
  }

  public async saveUsersIntoMatched(user_id: number, matched_user_id: number) {
    const matched = new MatchedDuos();
    matched.user_id = user_id;
    matched.matched_user_id = matched_user_id;

    return await this.matchedRepo.save(matched);
  }

  public async addUsersToLobby(user_id: number, liked_user_id: number) {
    const lobby = new MatchingLobby();
    lobby.user_id = user_id;
    lobby.liked_user_id = liked_user_id;

    return await this.lobbyRepo.save(lobby);
  }

  public async removeUserFromLobby(user_id: number, matched_user_id: number) {
    return await this.lobbyRepo
      .createQueryBuilder()
      .delete()
      .where('user_id = :user_id AND matched_user_id = :matched_user_id', { user_id, matched_user_id })
      .execute();
  }

  //! General

  public async findFullDetailed(id: number) {
    return await this.userRepo
      .createQueryBuilder('u')
      .leftJoin(MatchingSpams, 'ms', 'ms.user_id = u.id') // use filters (spams)
      .leftJoin(UserDetails, 'ud', 'ud.user_id = u.id') // use filters (spams)
      .select('*')
      .where('u.id = :id', { id })
      .getRawOne();
  }

  public async updateFilterListInSpam(props: FilterSpamProps) {
    const spam = await this.spamRepo.findOne({
      where: { user_id: props.user_id },
    });

    const newList = [...spam[props.list], props.id];

    spam[props.list] = newList;

    return await this.spamRepo.save(spam);
  }
}

interface FilterSpamProps {
  user_id: number;
  id: number;
  list: 'accept_list' | 'decline_list' | 'matched_list' | 'remove_list';
}
