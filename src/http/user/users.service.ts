import { Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { UserRegisterCache } from '../../database/entity/user_register_cache.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LolLeague } from './../../enum/lol_league.enum';
import { JwtService } from '@nestjs/jwt';
import { LolServer } from './../../enum/lol_server.enum';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { configs } from 'src/configs';
import { Request } from 'express';
import User from 'src/database/entity/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserRegisterCache) private readonly userRegCacheRepo: Repository<UserRegisterCache>,
  ) {}

  async userID() {
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

  async updateImagePath(id, path: string): Promise<User> {
    const user = await this.userRepository.findOne(id);

    user.img_path = '/user/profiles/' + path;

    return await this.userRepository.save(user);
  }

  async checkLolCredentialsValid(server: LolServer, summoner_name: string) {
    const check = true;

    // api here

    if (check) {
      return {
        league: LolLeague.BRONZE,
        server: server,
        summoner_name: summoner_name,
        check: true,
      };
    } else {
      return {
        check: false,
      };
    }
  }

  async cacheUserRegister(body: UserRegisterDto) {
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
    });

    return await userCache.save();
  }

  async saveUserByCachedData(userCached: UserRegisterCache, secret: string): Promise<User> {
    const { email, password, username } = userCached;

    const user = new User();
    user.email = email;
    user.password = password;
    user.username = username;
    user.secret = secret;

    return await this.userRepository.save(user);
  }

  async saveUser(user: User, secret: string) {
    user.secret = secret;

    return await this.userRepository.save(user);
  }
}
