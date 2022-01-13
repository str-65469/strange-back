import * as bcrypt from 'bcrypt';
import User from 'src/database/entity/user.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/app/modules/user/users.service';
import { UserDetailsServiceService } from 'src/app/modules/user/user_details.service';
import { UserLoginDto } from 'src/app/schemas/request/user/user_login.dto';
import { UserRegisterCacheService } from '../user/user_register_cache.service';
import { LolServer } from 'src/app/common/enum/lol_server.enum';
import { UserForgotPasswordCacheService } from '../user/user_forgot_password.service';
import { GenericException } from 'src/app/common/exceptions/general.exception';
import { ExceptionMessageCode } from 'src/app/common/enum/message_codes/exception_message_code.enum';

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
      throw new GenericException(HttpStatus.NOT_FOUND, ExceptionMessageCode.USER_EMAIL_OR_PASSWORD_INCORRECT);
    }

    const isPasswordMatch = await bcrypt.compare(userCredentials.password, user.password);

    if (!isPasswordMatch) {
      throw new GenericException(HttpStatus.NOT_FOUND, ExceptionMessageCode.USER_EMAIL_OR_PASSWORD_INCORRECT);
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
        throw new GenericException(HttpStatus.BAD_REQUEST, ExceptionMessageCode.USER_EMAIL_ALREADY_IN_USE);
      }

      if (user.username === username) {
        throw new GenericException(HttpStatus.BAD_REQUEST, ExceptionMessageCode.USERNAME_ALREADY_IN_USE);
      }
    }

    return user;
  }

  async emailExists(email: string, opts?: Partial<{ inForgotPasswordCache: boolean }>) {
    if (opts?.inForgotPasswordCache) {
      const user = await this.userForgotPasswordCacheService.findByEmail(email);

      return user;
    }

    const user = await this.userService.findOneByEmail(email, { fetchDetails: true });

    if (!user) {
      throw new GenericException(HttpStatus.NOT_FOUND, ExceptionMessageCode.USER_NOT_FOUND);
    }

    return user;
  }

  async summonerNameAndServerExists(server: LolServer, summonerName: string) {
    const userDetails = await this.userDetailsService.findBySummonerAndServer(server, summonerName);

    if (userDetails) {
      throw new GenericException(HttpStatus.BAD_REQUEST, ExceptionMessageCode.SUMMONER_NAME_ALREADY_IN_USE);
    }
  }

  async retrieveRegisterCachedData(id: number) {
    const cachedData = await this.userRegisterCacheService.findOne(id);

    if (!cachedData) {
      throw new GenericException(HttpStatus.BAD_REQUEST, ExceptionMessageCode.REGISTER_CACHE_NOT_FOUND);
    }

    return cachedData;
  }

  async retrieveForgotPasswordCachedData(id: number) {
    const cachedData = await this.userForgotPasswordCacheService.findOne(id);

    if (!cachedData) {
      throw new GenericException(HttpStatus.BAD_REQUEST, ExceptionMessageCode.FORGOT_PASSWORD_CACHE_NOT_FOUND);
    }

    return cachedData;
  }
}
