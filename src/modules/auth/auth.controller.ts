import { map } from 'rxjs/operators';
import { MatchingSpamService } from '../../app/core/matching_spam/matchingspamservice.service';
import { UserRegisterCacheService } from '../user/services/user_register_cache.service';
import { UserDetailsServiceService } from '../user/services/user_details.service';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto } from '../user/dto/user-register.dto';
import { UserLoginDto } from '../user/dto/user-login.dto';
import { Controller, Post, Res, Body, Get, Query, ParseIntPipe, UseGuards, HttpException, HttpStatus, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAcessService } from '../../app/jwt/jwt-access.service';
import { UsersService } from '../user/services/users.service';
import { MailService } from 'src/mail/mail.service';
import { JwtRegisterAuthGuard } from './guards/jwt-register.guard';
import { UserRegisterCache } from 'src/database/entity/user_register_cache.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtRefreshTokenAuthGuard } from './guards/jwt-refresh.guard';
import { JwtAcessTokenAuthGuard } from './guards/jwt-access.guard';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly jwtAcessService: JwtAcessService,
    private readonly mailServie: MailService,
    private readonly userDetailsService: UserDetailsServiceService,
    private readonly userRegisterCacheService: UserRegisterCacheService,
    private readonly matchingSpamService: MatchingSpamService,

    @InjectRepository(UserRegisterCache)
    private readonly userRegisterCacheRepo: Repository<UserRegisterCache>,
  ) {}

  @Post('/login')
  async login(@Body() body: UserLoginDto, @Res() res: Response) {
    if (process.env.NODE_ENV === 'development') {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
    } else {
      res.clearCookie('access_token', { domain: process.env.COOKIE_DOMAIN });
      res.clearCookie('refresh_token', { domain: process.env.COOKIE_DOMAIN });
    }
    const user = await this.authService.validateUser(body);
    const token = this.jwtAcessService.generateAccessToken(user, user.socket_id);

    const { refreshToken, secret } = this.jwtAcessService.generateRefreshToken(user);

    await this.userService.saveUser(user, secret);

    if (process.env.NODE_ENV === 'development') {
      res.cookie('access_token', token, {
        expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
        httpOnly: true,
      });

      res.cookie('refresh_token', refreshToken, {
        expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
        httpOnly: true,
      });
    } else {
      res.cookie('access_token', token, {
        expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
      });

      res.cookie('refresh_token', refreshToken, {
        expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
      });
    }

    return res.send(user);
  }

  @Post('/register')
  async register(@Body() body: UserRegisterDto) {
    const { email, summoner_name, server } = body;

    // first check if user exists
    await this.authService.userExists(email);

    // second check if user lol credentials is valid
    const checkedLolCreds = await this.userService.checkLolCredentialsValid(server, summoner_name);

    return checkedLolCreds.pipe(
      map(async (res) => {
        // third cache into database
        const userCached = await this.userService.cacheUserRegister(body, res);

        // send to mail
        this.mailServie.sendUserConfirmation(userCached);

        return { checkedLolCreds, check: true };
      }),
    );
  }

  @UseGuards(JwtRegisterAuthGuard)
  @Get('/register/confirm/')
  async registerVerify(@Query('id', ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
    if (process.env.NODE_ENV === 'development') {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
    } else {
      res.clearCookie('access_token', { domain: process.env.COOKIE_DOMAIN });
      res.clearCookie('refresh_token', { domain: process.env.COOKIE_DOMAIN });
    }

    // get data from cache
    const cachedData = await this.userRegisterCacheRepo.findOne(id);

    if (!cachedData) {
      throw new HttpException('Cached information not found', HttpStatus.BAD_REQUEST);
    }

    // generate refresh token and new secret
    const { refreshToken, secret } = this.jwtAcessService.generateRefreshToken(cachedData);
    const possibleIP = req.headers['x-forwarded-for'] as string;
    const ip = possibleIP || req.socket.remoteAddress || null;

    // save additional data to user details and data in user
    const user = await this.userService.saveUserByCachedData(cachedData, secret, ip);
    await this.userDetailsService.saveUserDetailsByCachedData(cachedData, user);

    // generate access_token and refresh token and new secret
    const accessToken = this.jwtAcessService.generateAccessToken(user, user.socket_id);

    // delete user cached data
    await this.userRegisterCacheService.delete(cachedData.id);

    // create user spam filter
    await this.matchingSpamService.createEmptySpam(user);

    // send httpOnly access_token cookie
    if (process.env.NODE_ENV === 'development') {
      res.cookie('access_token', accessToken, {
        expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
        httpOnly: true,
      });

      res.cookie('refresh_token', refreshToken, {
        expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
        httpOnly: true,
      });
    } else {
      res.cookie('access_token', accessToken, {
        expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
      });

      res.cookie('refresh_token', refreshToken, {
        expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
      });
    }

    return res.redirect(`${process.env.DASHBOARD_URL}/profile`);
  }

  @UseGuards(JwtRefreshTokenAuthGuard)
  @Get('/refresh')
  public async refreshToken(@Req() req: Request, @Res() res: Response) {
    if (process.env.NODE_ENV === 'development') {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
    } else {
      res.clearCookie('access_token', { domain: process.env.COOKIE_DOMAIN });
      res.clearCookie('refresh_token', { domain: process.env.COOKIE_DOMAIN });
    }

    const cookies = req.cookies;
    const accessToken = cookies.access_token;

    const accessTokenDecoded = this.jwtService.decode(accessToken) as { id: number; email: string };
    const id = accessTokenDecoded.id;
    const user = await this.userService.findOne(id);

    // generate access_token and refresh token and new secret
    const accessTokenNew = this.jwtAcessService.generateAccessToken(user, user.socket_id);
    const { refreshToken, secret } = this.jwtAcessService.generateRefreshToken(user);

    // update user secret
    await this.userService.saveUser(user, secret);

    if (process.env.NODE_ENV === 'development') {
      res.cookie('access_token', accessTokenNew, {
        expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
        httpOnly: true,
      });

      res.cookie('refresh_token', refreshToken, {
        expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
        httpOnly: true,
      });
    } else {
      res.cookie('access_token', accessTokenNew, {
        expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
      });

      res.cookie('refresh_token', refreshToken, {
        expires: new Date(new Date().getTime() + 86409000), // this cookie never expires
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
      });
    }

    return res.send({ message: 'token refresh successful' });
  }

  @UseGuards(JwtAcessTokenAuthGuard)
  @Get('/check')
  public async checkIfAuth() {
    return true;
  }

  @UseGuards(JwtAcessTokenAuthGuard)
  @Post('/logout')
  public async logout(@Res() res: Response) {
    if (process.env.NODE_ENV === 'development') {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
    } else {
      res.clearCookie('access_token', { domain: process.env.COOKIE_DOMAIN });
      res.clearCookie('refresh_token', { domain: process.env.COOKIE_DOMAIN });
    }

    return res.send({ message: 'logout successful' });
  }
}
