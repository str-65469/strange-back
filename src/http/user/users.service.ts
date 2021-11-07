import { HttpException, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { UserRegisterCache } from '../../database/entity/user_register_cache.entity';
import { LolCredentials, LolCredentialsResponse } from './schemas/lol_credentials';
import { UserPasswordUpdateDto } from './dto/user-update-password.dto';
import { RandomGenerator } from 'src/helpers/random_generator';
import { UserProfileUpdateDto } from './dto/user-update.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { LolServer } from './../../enum/lol_server.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, map } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { genSalt, hash } from 'bcrypt';
import { REQUEST } from '@nestjs/core';
import { configs } from 'src/configs';
import { Repository } from 'typeorm';
import { Request } from 'express';

import UserDetails from 'src/database/entity/user_details.entity';
import User from 'src/database/entity/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserDetails) private readonly userDetailsRepo: Repository<UserDetails>,
    @InjectRepository(UserRegisterCache) private readonly registerCacheRepo: Repository<UserRegisterCache>,
  ) {}

  userID() {
    const accessToken = this.request.cookies?.access_token;

    if (!accessToken) {
      throw new UnauthorizedException(configs.messages.exceptions.accessTokenMissing);
    }

    const accessTokenDecoded = this.jwtService.decode(accessToken) as { id: number; email: string };
    return accessTokenDecoded.id;
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepo.findOne(id);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.findOne({ where: { email } });
  }

  async getUserDetails(id?: number) {
    const userId = id ?? this.userID();

    return await this.userRepo.findOne(userId, {
      relations: ['details'],
    });
  }

  async updateImagePath(id, path: string) {
    const user = await this.userRepo.findOne(id);

    user.img_path = '/user/profiles/' + path;

    return await this.userRepo.save(user);
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
          const data: LolCredentials = res.data;

          return {
            level: data.level,
            league: data.division,
            league_number: data.divisionNumber,
            league_points: data.leaguePoints,
            win_rate: data.winRatio,
          };
        }),
        catchError((e) => {
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

  async updateUserProfile(data: UserProfileUpdateDto) {
    const id = this.userID();
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

  async updateUserCredentials(data: UserPasswordUpdateDto): Promise<User> {
    const id = this.userID();
    const salt = await genSalt(12);
    const password = await hash(data.password, salt);

    // update user
    const user = await this.findOne(id);
    user.password = password;
    user.email = data.email;

    await this.userRepo.save(user);

    return await this.getUserDetails(id);
  }
}
