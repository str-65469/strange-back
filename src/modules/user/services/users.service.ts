import User from 'src/database/entity/user.entity';
import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRegisterCache } from '../../../database/entity/user_register_cache.entity';
import { LolCredentials, LolCredentialsResponse } from '../schemas/lol_credentials';
import { UserPasswordUpdateDto } from '../dto/user-update-password.dto';
import { RandomGenerator } from 'src/app/utils/random_generator';
import { UserProfileUpdateDto } from '../dto/user-update.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { LolServer } from '../../../app/enum/lol_server.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, map } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { genSalt, hash } from 'bcrypt';
import { configs } from 'src/configs';
import { In, Not, Repository } from 'typeorm';
import { Request } from 'express';
import { UserDetails } from 'src/database/entity/user_details.entity';
import { Socket } from 'socket.io';
import { LolLeague } from 'src/app/enum/lol_league.enum';
import { MatchingSpamService } from 'src/app/services/core/matcheds/matchingspamservice.service';
import { AccessTokenPayload } from 'src/app/services/common/jwt-access.service';

export type UserSpamDetailed = User & { details: UserDetails; spams: MatchingSpams };

@Injectable()
export class UsersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly spamService: MatchingSpamService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserDetails) private readonly userDetailsRepo: Repository<UserDetails>,
    @InjectRepository(UserRegisterCache) private readonly registerCacheRepo: Repository<UserRegisterCache>,
  ) {}

  userID(request: Request) {
    const accessToken = request.cookies?.access_token;
    // const accessToken = this.request.cookies?.access_token;

    if (!accessToken) {
      throw new UnauthorizedException(configs.messages.exceptions.accessTokenMissing);
    }

    const accessTokenDecoded = this.jwtService.decode(accessToken) as { id: number; email: string };
    return accessTokenDecoded.id;
  }

  async user(id: number) {
    return await this.userRepo.findOne(id);
  }

  async getUserDetails(id?: number) {
    return await this.userRepo.findOne(id, {
      relations: ['details', 'belongings'],
    });
  }

  userSocketPayload(socket: Socket): AccessTokenPayload {
    const token = socket.handshake?.auth?.token;
    const accessTokenDecoded = this.jwtService.decode(token) as AccessTokenPayload;

    return accessTokenDecoded;

    // const headerCookies = socket.handshake.headers.cookie;
    // const cookies = cookie.parse(headerCookies);
    // const token = cookies?.access_token;
    // this.jwtAccessService.validateToken({ token, secret: process.env.JWT_SECRET });
    // const accessTokenDecoded = this.jwtService.decode(token) as AccessTokenPayload;

    // return accessTokenDecoded;
  }

  async userSpamAndDetails(id: number) {
    return await this.userRepo.findOne(id, { relations: ['spams', 'details'] });
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepo.findOne(id);
  }

  findOneForced(id: number): Promise<User> {
    return this.userRepo.createQueryBuilder().where('id = :id', { id }).select('*').getRawOne();
  }

  async findOneByEmail(email: string, getPassword: boolean = false): Promise<User | undefined> {
    if (getPassword) {
      return this.userRepo.createQueryBuilder().where('email = :email', { email }).select('*').getRawOne();
    }

    return this.userRepo.findOne({ where: { email } });
  }

  async findByEmailOrUsername(email: string, username: string): Promise<User | undefined> {
    return this.userRepo.findOne({ where: [{ email }, { username }] });
  }

  async updateImagePath(id, path: string) {
    const user = await this.userRepo.findOne(id);

    user.img_path = '/user/profiles/' + path;

    return await this.userRepo.save(user);
  }

  async checkLolCredentialsValid(server: LolServer, summoner_name: string) {
    console.log(server);
    console.log(summoner_name);

    return await this.httpService
      .get('/api/summoner_profile', {
        params: {
          server,
          summonerName: summoner_name,
        },
      })
      .pipe(
        map((res) => {
          const data: LolCredentials = res.data;

          console.log('=================1');
          console.log(data);

          return {
            level: data.level,
            league: data.division,
            league_number: data.divisionNumber,
            league_points: data.leaguePoints,
            win_rate: data.winRatio,
            profileImageId: data.profileImageId,
          };
        }),
        catchError((e) => {
          console.log('=================2');
          console.log(e);
          //   console.log(e);
          //   throw new HttpException(e.response.data, e.response.status);
          throw new HttpException('Check your division or summoner name please', e?.response?.status);
        }),
      );
  }

  async cacheUserRegister(body: UserRegisterDto, details: LolCredentialsResponse): Promise<UserRegisterCache> {
    const { email, password, server, summoner_name, username } = body;
    const { league, league_number, league_points, level, win_rate } = details;

    const secret = this.jwtService.sign({ email, summoner_name, username }, { expiresIn: '30m' });

    const d1 = new Date();
    const d2 = new Date(d1);
    d2.setMinutes(d1.getMinutes() + 30);

    return await this.registerCacheRepo.save({
      email,
      password,
      server,
      summoner_name,
      username,
      league,
      league_number,
      league_points,
      level,
      win_rate,
      secret_token: secret,
      expiry_date: d2,
    });
  }

  async saveUserByCachedData(userCached: UserRegisterCache, secret: string, ip: string): Promise<User> {
    const { email, password, username } = userCached;

    const user = this.userRepo.create({
      ip,
      email,
      password,
      username,
      secret,
      socket_id: RandomGenerator.randomString(),
    });

    return await this.userRepo.save(user);
  }

  async saveUser(user: User, secret: string) {
    user.secret = secret;

    return await this.userRepo.save(user);
  }

  async updateUserProfile(id: number, data: UserProfileUpdateDto) {
    const { username, discord_name, main_champions, main_lane } = data;

    // update user username
    await this.userRepo.save({ id, username });

    const userDetails = await this.userDetailsRepo.findOne({ where: { user: id } });

    userDetails.discord_name = discord_name;
    userDetails.main_champions = main_champions;
    userDetails.main_lane = main_lane;

    // update user details
    await this.userDetailsRepo.save(userDetails);

    return await this.getUserDetails(id);
  }

  async updateUserCredentials(id: number, data: UserPasswordUpdateDto): Promise<User> {
    const salt = await genSalt(12);
    const password = await hash(data.password, salt);

    // update user
    const user = await this.findOneForced(id);
    user.password = password;
    user.email = data.email;

    await this.userRepo.save(user);

    return await this.getUserDetails(id);
  }

  public async findNewDuoDetails(user: User, prevId?: number) {
    const { accept_list, remove_list, decline_list, matched_list } = user.spams;

    const al = accept_list ?? [];
    const rl = remove_list ?? [];
    const dl = decline_list ?? [];
    const ml = matched_list ?? [];

    // filter plus current
    let filterList = [...new Set([...al, ...rl, ...dl, ...ml, user.id])];

    // league filtering
    const leagues = Object.values(LolLeague);

    const currEnumIndex = leagues.indexOf(user.details.league);
    let filteredLeagues = [];
    if (currEnumIndex === 0) {
      filteredLeagues = leagues.filter((_, i) => i <= currEnumIndex + 1);
    } else if (currEnumIndex === leagues.length - 1) {
      filteredLeagues = leagues.filter((_, i) => i >= currEnumIndex - 1);
    } else {
      filteredLeagues = leagues.filter((_, i) => i >= currEnumIndex - 1 && i <= currEnumIndex + 1);
    }

    return this.userDetailsRepo.findOne({
      where: {
        user: Not(In(prevId ? [...filterList, prevId] : filterList)),
        league: In(filteredLeagues),
        server: user.details.server,
      },

      order: { created_at: 'DESC' },
      relations: ['user'],
    });

    const userDetail = await this.userDetailsRepo.findOne({
      where: {
        user: Not(In(prevId ? [...filterList, prevId] : filterList)),
        league: In(filteredLeagues),
        server: user.details.server,
      },

      order: { created_at: 'DESC' },
      relations: ['user'],
    });

    // console.log('============');
    // console.log('from up');

    // console.log(userDetail?.id);
    // console.log(prevId);
    // console.log(prevId ? [...filterList, prevId] : filterList);

    if (!userDetail) {
      // update decline list and pop
      if (prevId) {
        const id = await this.spamService.update({ user: user, addedId: prevId, list: 'decline_list' }, true);

        console.log('from decline 1');
        console.log(id);

        return this.userDetailsRepo.findOne({
          where: {
            user: id,
          },
          relations: ['user'],
        });
      }

      // find users from/via decline list
      const declinedDetail = await this.userDetailsRepo.findOne({
        where: {
          user: In(decline_list),
        },

        order: { created_at: 'ASC' },
        relations: ['user'],
      });

      //   console.log('from decline 2');
      //   console.log(declinedDetail.id);

      return declinedDetail;
    }

    // update decline list but not pop
    if (prevId) {
      await this.spamService.update({ user: user, addedId: prevId, list: 'decline_list' });
    }

    return userDetail;

    // if (prevId) {
    //   return await this.userDetailsRepo.findOne({
    //     where: {
    //       user: Raw((alias) => `${alias} > ${prevId} AND ${alias} NOT IN (${filterList})`),
    //       league: In(filteredLeagues),
    //       server: user.details.server,
    //     },
    //     order: { id: 'ASC' },
    //     relations: ['user'],
    //   });
    // }

    // return await this.userDetailsRepo.findOne({
    //   where: {
    //     user: Not(In(filterList)),
    //     league: In(filteredLeagues),
    //     server: user.details.server,
    //   },

    //   order: { id: 'ASC' },
    //   relations: ['user'],
    // });
  }
}
