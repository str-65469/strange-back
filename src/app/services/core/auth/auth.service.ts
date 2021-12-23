import * as bcrypt from 'bcrypt';
import User from 'src/database/entity/user.entity';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/app/services/core/user/users.service';
import { UserDetailsServiceService } from 'src/app/services/core/user/user_details.service';
import { UserLoginDto } from 'src/app/common/request/user/user_login.dto';
import { UserRegisterCacheService } from '../user/user_register_cache.service';
import { LolServer } from 'src/app/common/enum/lol_server.enum';
import { UserForgotPasswordCacheService } from '../user/user_forgot_password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly userDetailsService: UserDetailsServiceService,
    readonly userRegisterCacheService: UserRegisterCacheService,
    readonly userForgotPasswordCacheService: UserForgotPasswordCacheService,
  ) {}

  async validateUser(userCredentials: UserLoginDto): Promise<User> {
    // find user
    const user = await this.userService.findOneByEmail(userCredentials.email, { fetchPassword: true });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(userCredentials.password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async usernameEmailExists(email: string, username: string, opts?: { inCache: boolean }) {
    let user = null;

    if (opts?.inCache) {
      user = await this.userRegisterCacheService.findByEmailOrUsername(email, username);
    } else {
      user = await this.userService.findByEmailOrUsername(email, username);
    }

    if (user) {
      if (user.email === email) {
        throw new BadRequestException('Email already in use');
      }

      if (user.username === username) {
        throw new BadRequestException('Username already in use');
      }
    }

    return user;
  }

  async emailExists(email: string, opts?: Partial<{ inForgotPasswordCache: boolean }>) {
    if (opts?.inForgotPasswordCache) {
      const user = await this.userForgotPasswordCacheService.findByEmail(email);

      if (user) {
        throw new NotFoundException('user already in cache');
      }
    }

    const user = await this.userService.findOneByEmail(email, { fetchDetails: true });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async summonerNameAndServerExists(server: LolServer, summonerName: string) {
    const userDetails = await this.userDetailsService.findBySummonerAndServer(server, summonerName);

    if (userDetails) {
      throw new BadRequestException('Summoner name already in user');
    }
  }

  async retrieveRegisterCachedData(id: number) {
    const cachedData = await this.userRegisterCacheService.findOne(id);

    if (!cachedData) {
      throw new BadRequestException('Cached information not found');
    }

    return cachedData;
  }

  async retrieveForgotPasswordCachedData(id: number) {
    const cachedData = await this.userForgotPasswordCacheService.findOne(id);

    if (!cachedData) {
      throw new BadRequestException('Cached information not found');
    }

    return cachedData;
  }
}
