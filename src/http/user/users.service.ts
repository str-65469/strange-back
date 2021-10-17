import { catchError, map } from 'rxjs/operators';
import { HttpException, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { UserRegisterCache } from '../../database/entity/user_register_cache.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LolLeague } from './../../enum/lol_league.enum';
import { JwtService } from '@nestjs/jwt';
import { LolServer } from './../../enum/lol_server.enum';
import { Repository, getManager, getConnection } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { configs } from 'src/configs';
import { Request } from 'express';
import { RandomGenerator } from 'src/helpers/random_generator';
import User from 'src/database/entity/user.entity';
import UserDetails from 'src/database/entity/user_details.entity';
import { UserProfileUpdateDto } from './dto/user-update.dto';
import { HttpService } from '@nestjs/axios';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  userID() {
    const accessToken = this.request.cookies?.access_token;

    if (!accessToken) {
      throw new UnauthorizedException(configs.messages.exceptions.accessTokenMissing);
    }

    const accessTokenDecoded = this.jwtService.decode(accessToken) as { id: number; email: string };
    return accessTokenDecoded.id;
  }

  async findOne(id: number): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getUserDetails() {
    const userId = this.userID();

    return await getManager()
      .createQueryBuilder('users', 'u')
      .leftJoinAndSelect('user_details', 'us', 'us.user_id = u.id') // use filters (spams)
      .where('u.id = :id', { id: userId })
      .select(
        'u.id, u.username, u.img_path, u.email, us.discord_name, us.league, us.league_points, us.level, us.main_champions, us.main_lane, us.server, us.summoner_name',
      )
      .getRawOne();
  }

  async updateImagePath(id, path: string): Promise<User> {
    const user = await this.userRepository.findOne(id);

    user.img_path = '/user/profiles/' + path;

    return await this.userRepository.save(user);
  }

  async checkLolCredentialsValid(server: LolServer, summoner_name: string) {
    return await this.httpService
      .get('/api/summoner_profile', {
        params: {
          server,
          summonerName: summoner_name,
        },
      })
      .pipe(
        map((res) => {
          const data: CheckResp = res.data;

          const resp = {
            level: data.level,
            league: data.division,
            league_number: data.divisionNumber,
            league_points: data.leaguePoints,
            win_rate: data.winRatio,
          };

          return resp;
        }),
        catchError((e) => {
          throw new HttpException('Check your division or summoner name please', e.response.status);
          // throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }

  async cacheUserRegister(body: UserRegisterDto, details: ReturnResp) {
    const { email, password, server, summoner_name, username } = body;

    const d1 = new Date();
    const d2 = new Date(d1);
    d2.setMinutes(d1.getMinutes() + 30);

    const expiryDate = d2;
    const secret = this.jwtService.sign({ email, summoner_name, username }, { expiresIn: '30m' });

    const userCache = new UserRegisterCache({
      email,
      password,
      server,
      summoner_name,
      username,
      secret_token: secret,
      expiry_date: expiryDate,

      league: details.league,
      league_number: details.league_number,
      league_points: details.league_points,
      level: details.level,
      win_rate: details.win_rate,
    });

    return await userCache.save();
  }

  async saveUserByCachedData(userCached: UserRegisterCache, secret: string, ip: string): Promise<User> {
    const { email, password, username } = userCached;

    const user = new User();
    user.email = email;
    user.password = password;
    user.username = username;
    user.secret = secret;
    user.socket_id = RandomGenerator.randomString();
    user.ip = ip;

    return await this.userRepository.save(user);
  }

  async createAndSaveUserSpam(user_id: number) {
    //
    //   const spam = new MatchingSpams();
    //   spam.user_id = user_id;
    //   return await
  }

  async saveUser(user: User, secret: string) {
    user.secret = secret;

    return await this.userRepository.save(user);
  }

  async updateUserProfile(data: UserProfileUpdateDto) {
    const userId = this.userID();

    // update user username
    await this.userRepository.save({
      id: userId,
      username: data.username,
    });

    // update user details
    await getConnection()
      .createQueryBuilder()
      .update(UserDetails)
      .set({
        discord_name: data.discord_name,
        main_champions: data.main_champions,
        main_lane: data.main_lane,
      })
      .where('id = :id', { id: userId })
      .execute();

    // return
    return await getManager()
      .createQueryBuilder('users', 'u')
      .leftJoinAndSelect('user_details', 'us', 'us.user_id = u.id') // use filters (spams)
      .where('u.id = :id', { id: userId })
      .select(
        'u.id, u.username, u.img_path, u.email, us.discord_name, us.league, us.league_points, us.level, us.main_champions, us.main_lane, us.server, us.summoner_name',
      )
      .getRawOne();
  }
}

interface CheckResp {
  level: number;
  summonerName: string;
  division: LolLeague;
  divisionNumber: number;
  leaguePoints: number;
  wins: number;
  losses: number;
  winRatio: number;
}

export interface ReturnResp {
  level: number;
  league: LolLeague;
  league_number: number;
  league_points: number;
  win_rate: number;
}
