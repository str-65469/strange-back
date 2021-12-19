import * as bcrypt from 'bcrypt';
import User from 'src/database/entity/user.entity';
import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/app/services/core/user/users.service';
import { UserDetailsServiceService } from 'src/app/services/core/user/user_details.service';
import { UserLoginDto } from 'src/app/common/request/user/user_login.dto';
import { UserRegisterCacheService } from '../user/user_register_cache.service';
import { LolServer } from 'src/app/common/enum/lol_server.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly userDetailsService: UserDetailsServiceService,
    private readonly userRegisterCacheService: UserRegisterCacheService,
  ) {}

  async validateUser(userCredentials: UserLoginDto): Promise<User> {
    // find user
    const user = await this.userService.findOneByEmail(userCredentials.email, true);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(userCredentials.password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async usernameEmailExists(email: string, username: string, opts?: { inCache: boolean }): Promise<void> {
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
  }

  async summonerNameAndServerExists(server: LolServer, summonerName: string) {
    const userDetails = await this.userDetailsService.findBySummonerAndServer(server, summonerName);

    console.log(userDetails);

    if (userDetails) {
      throw new BadRequestException('Summoner name already in user');
    }
  }

  async retrieveCachedData(id: number) {
    const cachedData = await this.userRegisterCacheService.findOne(id);

    if (!cachedData) {
      throw new HttpException('Cached information not found', HttpStatus.BAD_REQUEST);
    }

    return cachedData;
  }
}
