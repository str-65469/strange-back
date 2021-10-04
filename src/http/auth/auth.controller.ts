import { UserRegisterCacheService } from './../user_register_cache/user_register_cache.service';
import { UserDetailsServiceService } from '../user_details/user_details.service';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto } from './../user/dto/user-register.dto';
import { UserLoginDto } from '../user/dto/user-login.dto';
import {
  Controller,
  Post,
  Res,
  Body,
  Get,
  Query,
  ParseIntPipe,
  UseGuards,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAcessService } from '../jwt/jwt-access.service';
import { UsersService } from '../user/users.service';
import { MailService } from 'src/mail/mail.service';
import * as jwt from 'jsonwebtoken';
import { JwtRegisterAuthGuard } from './guards/jwt-register.guard';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('/auth')
export class AuthController {
  constructor(
    //   private readonly user
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly jwtAcessService: JwtAcessService,
    private readonly mailServie: MailService,
    private readonly userDetailsService: UserDetailsServiceService,
    private readonly userRegisterCacheService: UserRegisterCacheService,

    @InjectRepository(UserRegisterCache)
    private readonly userRegisterCacheRepo: Repository<UserRegisterCache>,
  ) {}

  @Post('/login')
  async login(@Body() body: UserLoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(body);
    const token = this.jwtAcessService.generateAccessToken(user);

    res.cookie('accessToken', token, {
      expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
      sameSite: 'none',
      httpOnly: true,
    });

    return res.send(user);
  }

  @Post('/register')
  async register(@Body() body: UserRegisterDto) {
    const { email, summoner_name, server } = body;

    // first check if user exists
    await this.authService.userExists(email);

    // second check if user lol credentials is valid
    const check = await this.userService.checkLolCredentialsValid(server, summoner_name);

    if (check) {
      // third cache into database
      const userCached = await this.userService.cacheUserRegister(body);

      // send to mail
      this.mailServie.sendUserConfirmation(userCached);
    }
  }

  @UseGuards(JwtRegisterAuthGuard)
  @Get('/register/confirm/')
  async registerVerify(@Query('id', ParseIntPipe) id: number, @Res() res: Response) {
    // get data from cache
    const cachedData = await this.userRegisterCacheRepo.findOne(id);

    if (!cachedData) {
      throw new HttpException('Cached information not found', HttpStatus.BAD_REQUEST);
    }

    // generate access_token and refresh token and new secret
    const accessToken = this.jwtAcessService.generateAccessToken(cachedData);
    const refreshTokenResponse = this.jwtAcessService.generateRefreshToken(cachedData);

    // save cached data in user
    const saved = await this.userService.saveUserByCachedData(cachedData, refreshTokenResponse);

    // save additional data to user details
    const savedAdditional = await this.userDetailsService.saveUserDetailsByCachedData(cachedData);

    // delete user cached data
    const deletedUser = await this.userRegisterCacheService.delete(cachedData.id);

    // send httpOnly access_token cookie
    res.cookie('access_token', accessToken, {
      expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
      sameSite: 'none',
      httpOnly: true,
    });

    return res.send({
      saved,
      savedAdditional,
      deletedUser,
    });
  }
}
