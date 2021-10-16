import { LolLeague } from 'src/enum/lol_league.enum';
import { MatchedDuos } from './../../database/entity/matched_duos.entity';
import { MatchingSpams } from './../../database/entity/matching_spams.entity';
import { getManager, Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { AccessTokenPayload, JwtAcessService } from 'src/http/jwt/jwt-access.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCombined } from '../duofinder/duo_finder.service';
import { MatchingLobby } from 'src/database/entity/matching_lobby.entity';
import { HandleDuoFindBody } from '../duofinder/responses';
import * as cookie from 'cookie';

@Injectable()
export class SocketUserService {
  constructor(
    private readonly jwtAccessService: JwtAcessService,
    private readonly jwtService: JwtService,
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
      const matchedUsers = await getManager()
        .createQueryBuilder('users', 'u')
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

    return await getManager()
      .createQueryBuilder('user_details', 'ud')
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

    return await getManager()
      .createQueryBuilder('user_details', 'ud')
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
    return await getManager()
      .createQueryBuilder('user_details', 'ud')
      .andWhere('user_id = :user_id', { user_id })
      .select(
        'ud.id, ud.discord_name, ud.league, ud.league_points, ud.level, ud.main_champions, ud.main_lane, ud.server, ud.summoner_name',
      )
      .getRawOne();
  }

  public async findDuo(id: number) {
    const duo = await getManager()
      .createQueryBuilder('users', 'u')
      .where('u.id = :id', { id })
      .select('u.email, u.id, u.img_path, u.username')
      .getRawOne();

    // duo.full_image_path = duo.img_path ? process.env.APP_URL + '/upload' + duo.img_path : null;
    duo.full_image_path = duo.img_path ?? null;

    return duo;
  }

  public async findIfUserIsWaiting(id: number) {
    return await this.lobbyRepo.findOne({
      where: { user_id: id },
    });
  }

  public async saveUsersIntoMatched(user_id: number, id: number) {
    const matched = new MatchedDuos();
    matched.user_id = user_id;
    matched.matched_user_id = id;

    return await this.matchedRepo.save(matched);
  }

  public async removeUserFromLobby(user_id: number) {
    return await this.lobbyRepo.delete({ user_id });
  }

  public async addUsersToLobby(user_id: number, id: number) {
    const lobby = new MatchingLobby();
    lobby.user_id = user_id;
    lobby.liked_user_id = id;

    return await this.lobbyRepo.save(lobby);
  }

  //! General

  public async findFullDetailed(id: number) {
    return await getManager()
      .createQueryBuilder('users', 'u')
      .leftJoin('matching_spams', 'ms', 'ms.user_id = u.id') // use filters (spams)
      .leftJoin('user_details', 'us', 'us.user_id = u.id') // use filters (spams)
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
