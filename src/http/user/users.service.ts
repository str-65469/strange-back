import { JwtService } from '@nestjs/jwt';
import { LolServer } from './../../enum/lol_server.enum';
import { UserRegisterCache } from '../../database/entity/user_register_cache.entity';
import { Injectable } from '@nestjs/common';
import User from 'src/database/entity/user.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenResponse } from '../jwt/jwt-access.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async checkLolCredentialsValid(server: LolServer, summoner_name: string): Promise<boolean> {
    // use api here

    return true;
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

  async saveUserByCachedData(userCached: UserRegisterCache, opt: RefreshTokenResponse): Promise<User> {
    const { email, password, username } = userCached;

    const user = new User();
    user.email = email;
    user.password = password;
    user.username = username;
    user.secret = opt.secret;
    user.refresh_token = opt.refreshToken;

    return await this.userRepository.save(user);
  }

  async saveUser(user: User, opt: RefreshTokenResponse) {
    user.secret = opt.secret;
    user.refresh_token = opt.refreshToken;

    return await this.userRepository.save(user);
  }
}
