import * as bcrypt from 'bcrypt';
import User from 'src/database/entity/user.entity';
import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRegisterCache } from '../../../../database/entity/user_register_cache.entity';
import { LolCredentials, LolCredentialsResponse } from '../../../common/schemas/lol_credentials';
import { RandomGenerator } from 'src/app/utils/random_generator';
import { LolServer } from '../../../common/enum/lol_server.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { configs } from 'src/configs/config';
import { In, Not, Repository } from 'typeorm';
import { Request } from 'express';
import { UserDetails } from 'src/database/entity/user_details.entity';
import { Socket } from 'socket.io';
import { LolLeague } from 'src/app/common/enum/lol_league.enum';
import { AccessTokenPayload } from 'src/app/services/common/jwt_access.service';
import { UserRegisterDto } from 'src/app/common/request/user/user_register.dto';
import { UserProfileUpdateDto } from 'src/app/common/request/user/user_update.dto';
import { UserPasswordUpdateDto } from 'src/app/common/request/user/user_update_password.dto';
import tokens from 'src/configs/addons/tokens';
import { generateCompressedSprite } from 'src/app/utils/dicebear';

export type UserSpamDetailed = User & { details: UserDetails; spams: MatchingSpams };

@Injectable()
export class UsersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserDetails) private readonly userDetailsRepo: Repository<UserDetails>,
    @InjectRepository(UserRegisterCache) private readonly registerCacheRepo: Repository<UserRegisterCache>,
  ) {}

  userID(request: Request) {
    const accessToken = request.cookies?.access_token;

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

  async findOneByEmail(
    email: string,
    opts?: Partial<{ fetchPassword: boolean; fetchDetails: boolean }>,
  ): Promise<User | undefined> {
    if (opts?.fetchPassword) {
      return this.userRepo
        .createQueryBuilder('users')
        .where('users.email = :email', { email })
        .addSelect('users.password')
        .getOne();
    }

    if (opts?.fetchDetails) {
      return this.userRepo.findOne({ where: { email }, relations: ['details'] });
    }

    return this.userRepo.findOne({ where: { email } });
  }

  findByEmailOrUsername(email: string, username: string) {
    return this.userRepo.findOne({ where: [{ email }, { username }] });
  }

  async updateImagePath(id, path: string) {
    const user = await this.userRepo.findOne(id);

    user.img_path = '/user/profiles/' + path;

    return await this.userRepo.save(user);
  }

  async checkLolCredentialsValid(server: LolServer, summoner_name: string) {
    return this.httpService.axiosRef
      .get<LolCredentials>('/api/summoner_profile', {
        params: {
          server,
          summonerName: summoner_name,
        },
      })
      .then((res) => {
        const { level, profileImageId } = res.data;

        return {
          level,
          profileImageId,
          league: res.data.division,
          league_number: res.data.divisionNumber,
          league_points: res.data.leaguePoints,
          win_rate: res.data.winRatio,
        };
      })
      .catch((err) => {
        throw new HttpException('Check your division or summoner name please', err?.response?.status);
      });
  }

  async cacheUserRegister(body: UserRegisterDto, details: LolCredentialsResponse): Promise<UserRegisterCache> {
    const { email, password, server, summoner_name, username } = body;
    const { league, league_number, league_points, level, win_rate } = details;
    const secret = this.jwtService.sign({ email, summoner_name, username }, { expiresIn: tokens.user_register_token });

    const d1 = new Date();
    const d2 = new Date(d1);
    d2.setMinutes(d1.getMinutes() + 30);

    const pass = bcrypt.hashSync(password, bcrypt.genSaltSync(12));

    return await this.registerCacheRepo.save({
      email,
      server,
      summoner_name,
      username,
      league,
      league_number,
      league_points,
      level,
      win_rate,
      password: pass,
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
      img_path: generateCompressedSprite() as string,
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
    const password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(12));

    // update user
    const user = await this.findOneForced(id);
    user.password = password;

    await this.userRepo.save(user);

    return await this.getUserDetails(id);
  }

  async updatePassword(id: number, newPassword: string) {
    const password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(12));

    return this.userRepo.update(id, {
      password,
    });
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
  }
}
